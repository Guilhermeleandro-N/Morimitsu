import { useEffect, useMemo, useState } from "react";
import "./ConcederPermissoes.css";
import {
  listarUsuarios,
  listarPerfis,
  listarPerfisDoUsuario,
  atribuirPerfil,
  removerPerfil,
  listarPermissoesDoUsuario,
  definirPermissaoDoUsuario,
} from "../../services/authorizationService";
import { useToast } from "../../context/ToastContext";

const TABS = {
  ALUNO: { nome: "ALUNO", label: "Aluno" },
  PROFESSOR: { nome: "PROFESSOR", label: "Professor" },
};

// Ordem de agrupamento das permissões por categoria
const CATEGORIAS = [
  { titulo: "Turmas", padrao: /turma/ },
  { titulo: "Alunos", padrao: /student|aluno/ },
  { titulo: "Professores", padrao: /professor/ },
  { titulo: "Presenças", padrao: /attendance|presenca/ },
  { titulo: "Treinos", padrao: /training|treino/ },
  { titulo: "Usuários", padrao: /^user\./ },
  { titulo: "Dashboard", padrao: /dashboard/ },
  { titulo: "Perfil", padrao: /profile|perfil/ },
  { titulo: "Notificações", padrao: /notification|notificacao/ },
];

function ConcederPermissoes() {
  const { addToast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("PROFESSOR");
  const [perfisUsuario, setPerfisUsuario] = useState([]);
  const [permissoesUsuario, setPermissoesUsuario] = useState([]);
  const [permissoesPorPerfil, setPermissoesPorPerfil] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [salvandoPermissao, setSalvandoPermissao] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [users, perfis] = await Promise.all([
          listarUsuarios(),
          listarPerfis(),
        ]);
        const allUsers = Array.isArray(users) ? users : [];

        // Filtra admins: verifica perfil de cada usuário
        const naoAdmins = [];
        for (const user of allUsers) {
          try {
            const perfisUser = await listarPerfisDoUsuario(user.id);
            const isAdmin = perfisUser.some((p) => p.nome?.toLowerCase() === "admin");
            if (!isAdmin) naoAdmins.push(user);
          } catch {
            naoAdmins.push(user); // se falhar, inclui
          }
        }
        setUsuarios(naoAdmins);

        // Mapa nome do perfil -> permissões padrão daquele perfil
        const mapa = {};
        (Array.isArray(perfis) ? perfis : []).forEach((p) => {
          mapa[(p.nome || "").toUpperCase()] = (p.perfilPermissions || [])
            .map((pp) => pp.permission)
            .filter(Boolean);
        });
        setPermissoesPorPerfil(mapa);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    }
    carregar();
  }, []);

  async function selecionarUsuario(user) {
    setUsuarioSelecionado(user);
    try {
      const perfis = await listarPerfisDoUsuario(user.id);
      setPerfisUsuario(perfis);
    } catch {
      setPerfisUsuario([]);
    }
    setCarregando(true);
    try {
      const perms = await listarPermissoesDoUsuario(user.id);
      setPermissoesUsuario(perms);
    } catch {
      setPermissoesUsuario([]);
    } finally {
      setCarregando(false);
    }
  }

  // Tenta achar o perfil pelo nome (case insensitive) nos perfis do usuário
  const perfilAtivo = perfisUsuario.find(
    (p) => p.nome?.toLowerCase() === tipoUsuario.toLowerCase()
  );

  const permissoesUsuarioSet = useMemo(
    () => new Set(permissoesUsuario.map((p) => p.id)),
    [permissoesUsuario]
  );

  const permissoesDoPerfil = useMemo(
    () => permissoesPorPerfil[tipoUsuario] || [],
    [permissoesPorPerfil, tipoUsuario]
  );

  // Agrupa as permissões por categoria (turma, aluno, professor, ...)
  const permissoesAgrupadas = useMemo(() => {
    let semGrupo = [...permissoesDoPerfil];
    const grupos = [];

    for (const cat of CATEGORIAS) {
      const padrao = cat.padrao;
      const correspondentes = semGrupo.filter((p) =>
        padrao.test((p.codigo || "").toLowerCase())
      );

      if (correspondentes.length > 0) {
        grupos.push({
          titulo: cat.titulo,
          perms: [...correspondentes].sort((a, b) =>
            (a.descricao || "").localeCompare(b.descricao || "")
          ),
        });
        semGrupo = semGrupo.filter(
          (p) => !padrao.test((p.codigo || "").toLowerCase())
        );
      }
    }

    if (semGrupo.length > 0) {
      grupos.push({
        titulo: "Outros",
        perms: [...semGrupo].sort((a, b) =>
          (a.descricao || "").localeCompare(b.descricao || "")
        ),
      });
    }

    return grupos;
  }, [permissoesDoPerfil]);

  async function handleTogglePermissao(perm) {
    if (!usuarioSelecionado || salvandoPermissao) return;
    const ativo = permissoesUsuarioSet.has(perm.id);
    setSalvandoPermissao(perm.id);
    try {
      await definirPermissaoDoUsuario(usuarioSelecionado.id, perm.id, !ativo);
      setPermissoesUsuario((prev) => {
        const novos = prev.filter((p) => p.id !== perm.id);
        if (!ativo) novos.push(perm);
        return novos;
      });
    } catch (error) {
      console.error("Erro ao alternar permissão:", error);
    } finally {
      setSalvandoPermissao(null);
    }
  }

  async function handleTogglePerfil() {
    if (!usuarioSelecionado) return;
    try {
      if (perfilAtivo) {
        await removerPerfil(usuarioSelecionado.id, perfilAtivo.id);
        setPerfisUsuario((prev) => prev.filter((p) => p.id !== perfilAtivo.id));
        addToast(
          `Perfil base de ${TABS[tipoUsuario]?.label} removido com sucesso.`,
          "success"
        );
      } else {
        // Busca o perfil pelo nome
        const todosPerfis = await listarPerfis();
        const perfilParaAtribuir = todosPerfis.find(
          (p) => p.nome?.toLowerCase() === tipoUsuario.toLowerCase()
        );
        if (perfilParaAtribuir) {
          await atribuirPerfil(usuarioSelecionado.id, perfilParaAtribuir.id);
          setPerfisUsuario((prev) => [...prev, perfilParaAtribuir]);
          addToast(
            `Perfil base de ${TABS[tipoUsuario]?.label} atribuído com sucesso.`,
            "success"
          );
        }
      }
      const perms = await listarPermissoesDoUsuario(usuarioSelecionado.id);
      setPermissoesUsuario(perms);
    } catch (error) {
      console.error("Erro ao alternar perfil:", error);
      addToast(
        error?.response?.data?.message ||
          "Erro ao alternar perfil do usuário.",
        "error"
      );
    }
  }

  function renderPermissaoCard(perm) {
    return (
      <div className="permissao-card" key={perm.id}>
        <div>
          <h4>{perm.descricao}</h4>
          <p>Código: {perm.codigo}</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={permissoesUsuarioSet.has(perm.id)}
            disabled={carregando || salvandoPermissao !== null}
            onChange={() => handleTogglePermissao(perm)}
          />
          <span className="slider"></span>
        </label>
      </div>
    );
  }

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) =>
      u.nome?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [usuarios, busca]);

  return (
    <div className="permissoes-container">
      <div className="page-header">
        <div>
          <h1>Conceder Permissões</h1>
          <p>Conceder permissões aos usuários</p>
        </div>
      </div>

      <div className="permissoes-content">
        <div className="usuarios-card">
          <input
            type="text"
            placeholder="Pesquisar usuário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pesquisa-input"
          />
          <div className="usuarios-lista">
            {usuariosFiltrados.map((user) => (
              <div
                key={user.id}
                className={usuarioSelecionado?.id === user.id ? "usuario-item ativo" : "usuario-item"}
                onClick={() => selecionarUsuario(user)}
              >
                {user.nome}
              </div>
            ))}
          </div>
        </div>

        <div className="config-card">
          {usuarioSelecionado ? (
            <>
              <div className="config-topo">
                <div>
                  <h2>{usuarioSelecionado.nome}</h2>
                  <p>Conceder permissões ao usuário selecionado</p>
                </div>
                <div className="tipo-container">
                  {Object.values(TABS).map((tab) => (
                    <button
                      key={tab.nome}
                      className={tipoUsuario === tab.nome ? "tipo-btn ativo" : "tipo-btn"}
                      onClick={() => setTipoUsuario(tab.nome)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {carregando ? (
                <div className="empty-selection">Carregando permissões...</div>
              ) : (
                <>
                  <h3 className="permissoes-section-title">
                    Permissões do perfil de {TABS[tipoUsuario]?.label}
                  </h3>
                  {permissoesAgrupadas.length > 0 ? (
                    <div className="permissoes-grid">
                      {permissoesAgrupadas.flatMap((grupo) =>
                        grupo.perms.map(renderPermissaoCard)
                      )}
                    </div>
                  ) : (
                    <div className="permissoes-grid">
                      <div className="permissao-card">
                        <div>
                          <h4>Nenhuma permissão</h4>
                          <p>Este perfil não possui permissões configuradas.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="salvar-container">
                <button className="btn-salvar" onClick={handleTogglePerfil}>
                  {perfilAtivo
                    ? `Remover perfil base de ${TABS[tipoUsuario]?.label}`
                    : `Atribuir perfil base de ${TABS[tipoUsuario]?.label}`}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-selection">
              Selecione um usuário para gerenciar suas permissões.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConcederPermissoes;
