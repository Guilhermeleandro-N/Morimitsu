import { useEffect, useMemo, useState } from "react";
import "./ConcederPermissoes.css";
import { listarUsuarios, listarPerfis, listarPerfisDoUsuario, atribuirPerfil, removerPerfil, listarPermissoesDoPerfil } from "../../services/authorizationService";

const TABS = {
  ALUNO: { nome: "ALUNO", label: "Aluno" },
  PROFESSOR: { nome: "PROFESSOR", label: "Professor" },
};

function ConcederPermissoes() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("PROFESSOR");
  const [perfisUsuario, setPerfisUsuario] = useState([]);
  const [permissoesPerfil, setPermissoesPerfil] = useState({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const users = await listarUsuarios();
        const allUsers = Array.isArray(users) ? users : [];

        // Filtra admins: verifica perfil de cada usuário
        const naoAdmins = [];
        for (const user of allUsers) {
          try {
            const perfis = await listarPerfisDoUsuario(user.id);
            const isAdmin = perfis.some((p) => p.nome?.toLowerCase() === "admin");
            if (!isAdmin) naoAdmins.push(user);
          } catch {
            naoAdmins.push(user); // se falhar, inclui
          }
        }
        setUsuarios(naoAdmins);
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
  }

  // Tenta achar o perfil pelo nome (case insensitive) nos perfis do usuário
  const perfilAtivo = perfisUsuario.find(
    (p) => p.nome?.toLowerCase() === tipoUsuario.toLowerCase()
  );

  async function carregarPermissoes() {
    if (!perfilAtivo) return;
    if (permissoesPerfil[perfilAtivo.id]) return;
    setCarregando(true);
    try {
      const perms = await listarPermissoesDoPerfil(perfilAtivo.id);
      setPermissoesPerfil((prev) => ({ ...prev, [perfilAtivo.id]: perms }));
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (perfilAtivo) carregarPermissoes();
  }, [perfilAtivo]);

  const permissoesAtuais = perfilAtivo ? permissoesPerfil[perfilAtivo.id] || [] : [];

  async function handleTogglePerfil() {
    if (!usuarioSelecionado) return;
    try {
      if (perfilAtivo) {
        await removerPerfil(usuarioSelecionado.id, perfilAtivo.id);
        setPerfisUsuario((prev) => prev.filter((p) => p.id !== perfilAtivo.id));
      } else {
        // Busca o perfil pelo nome
        const todosPerfis = await listarPerfis();
        const perfilParaAtribuir = todosPerfis.find(
          (p) => p.nome?.toLowerCase() === tipoUsuario.toLowerCase()
        );
        if (perfilParaAtribuir) {
          await atribuirPerfil(usuarioSelecionado.id, perfilParaAtribuir.id);
          setPerfisUsuario((prev) => [...prev, perfilParaAtribuir]);
        }
      }
    } catch (error) {
      console.error("Erro ao alternar perfil:", error);
    }
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

              <div className="permissoes-grid">
                {permissoesAtuais.length > 0 ? (
                  permissoesAtuais.map((perm) => (
                    <div className="permissao-card" key={perm.id}>
                      <div>
                        <h4>{perm.descricao}</h4>
                        <p>Código: {perm.codigo}</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={!!perfilAtivo}
                          onChange={handleTogglePerfil}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="permissao-card">
                    <div>
                      <h4>{carregando ? "Carregando..." : "Nenhuma permissão"}</h4>
                      <p>
                        {perfilAtivo
                          ? "Este perfil não possui permissões configuradas."
                          : `Usuário não possui o perfil de ${TABS[tipoUsuario]?.label || tipoUsuario}.`}
                      </p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!!perfilAtivo}
                        onChange={handleTogglePerfil}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                )}
              </div>

              <div className="salvar-container">
                <button className="btn-salvar" onClick={handleTogglePerfil}>
                  {perfilAtivo ? `Remover perfil de ${TABS[tipoUsuario]?.label}` : `Atribuir perfil de ${TABS[tipoUsuario]?.label}`}
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
