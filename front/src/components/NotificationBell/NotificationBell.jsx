import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFilter } from "react-icons/fa";
import {
  listarNotificacoes,
  contarNotificacoesNaoLidas,
  marcarNotificacaoComoLida,
} from "../../services/notificacaoService";
import { buscarDashboardProfessor } from "../../services/professorService";
import { AuthContext } from "../../context/AuthContext";
import "./NotificationBell.css";

function formatarData(data) {
  if (!data) return "";
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const FILTROS = ["TODAS", "ALUNO", "TURMA"];

function NotificationBell() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const ehProfessor = (user?.roles || []).some((r) =>
    ["admin", "professor"].includes(r)
  );
  const ehAluno = (user?.roles || []).includes("aluno");
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [filtro, setFiltro] = useState("TODAS");
  const [painelAvisos, setPainelAvisos] = useState([]);
  const [avisosLidos, setAvisosLidos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("morimitsu_avisos_lidos") || "[]");
    } catch {
      return [];
    }
  });
  const ref = useRef(null);

  function persistirAvisosLidos(ids) {
    setAvisosLidos(ids);
    try {
      localStorage.setItem("morimitsu_avisos_lidos", JSON.stringify(ids));
    } catch (error) {
      console.error("Erro ao salvar avisos lidos:", error);
    }
  }

  function proximoFiltro() {
    const idx = FILTROS.indexOf(filtro);
    setFiltro(FILTROS[(idx + 1) % FILTROS.length]);
  }

  async function carregarAvisosPainel() {
    try {
      const data = await buscarDashboardProfessor();
      const avisos = [];
      (data?.proximos_graduacao || []).forEach((g) => {
        const id = `graduacao-${g.aluno_id}`;
        avisos.push({
          id,
          aluno_id: g.aluno_id,
          mensagem:
            g.frequencias_restantes === 0
              ? `O aluno ${g.nome} já deve ser graduado`
              : `Falta ${g.frequencias_restantes} frequência${
                  g.frequencias_restantes === 1 ? "" : "s"
                } para o aluno ${g.nome} se graduar`,
          tipo: "graduacao",
          lida: avisosLidos.includes(id),
          created_at: new Date().toISOString(),
        });
      });
      (data?.proximos_aniversario || []).forEach((a) => {
        const id = `aniversario-${a.aluno_id}`;
        avisos.push({
          id,
          aluno_id: a.aluno_id,
          mensagem:
            a.dias_restantes === 0
              ? `Hoje é o aniversário de ${a.nome}!`
              : `O aniversário de ${a.nome} é em ${a.dias_restantes} dia${
                  a.dias_restantes === 1 ? "" : "s"
                }!`,
          tipo: "aniversario",
          lida: avisosLidos.includes(id),
          created_at: new Date().toISOString(),
        });
      });
      setPainelAvisos(avisos);
    } catch (error) {
      console.error("Erro ao carregar avisos do painel:", error);
      setPainelAvisos([]);
    }
  }

  const avisosNaoLidos = painelAvisos.filter((a) => !a.lida).length;
  const totalNaoLidas = naoLidas + avisosNaoLidos;

  function dedupeTreino(lista) {
    const vistos = new Set();
    return lista.filter((n) => {
      if (n.tipo !== "treino") return true;
      if (vistos.has(n.mensagem)) return false;
      vistos.add(n.mensagem);
      return true;
    });
  }

  const notificacoesFiltradas = useMemo(() => {
    if (filtro === "ALUNO") {
      return painelAvisos;
    }
    if (filtro === "TURMA") {
      return dedupeTreino(
        notificacoes.filter((n) => n.tipo === "treino")
      );
    }

    const chavesAvisos = new Set(
      painelAvisos.map((a) => `${a.tipo}-${a.aluno_id}`)
    );
    const notificacoesAluno = notificacoes.filter(
      (n) =>
        n.tipo !== "treino" &&
        !chavesAvisos.has(`${n.tipo}-${n.aluno_id}`)
    );
    const notificacoesTreino = dedupeTreino(
      notificacoes.filter((n) => n.tipo === "treino")
    );

    return [...painelAvisos, ...notificacoesAluno, ...notificacoesTreino];
  }, [notificacoes, painelAvisos, filtro]);

  async function carregar() {
    try {
      setCarregando(true);
      const [lista, count] = await Promise.all([
        listarNotificacoes(),
        contarNotificacoesNaoLidas(),
      ]);
      setNotificacoes(Array.isArray(lista) ? lista : []);
      setNaoLidas(count);
      if (ehProfessor) {
        await carregarAvisosPainel();
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    function handleClickFora(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  async function handleMarcarLida(id) {
    if (id.startsWith("graduacao-") || id.startsWith("aniversario-")) {
      setPainelAvisos((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
      if (!avisosLidos.includes(id)) {
        persistirAvisosLidos([...avisosLidos, id]);
      }
      return;
    }

    const alvo = notificacoes.find((n) => n.id === id);
    const doMesmoTreino =
      alvo?.tipo === "treino"
        ? notificacoes.filter((n) => n.tipo === "treino" && n.mensagem === alvo.mensagem)
        : [alvo];

    try {
      await Promise.all(
        doMesmoTreino
          .filter((n) => !n.lida)
          .map((n) => marcarNotificacaoComoLida(n.id))
      );
      setNotificacoes((prev) =>
        prev.map((n) =>
          doMesmoTreino.some((t) => t.id === n.id)
            ? { ...n, lida: true }
            : n
        )
      );
      setNaoLidas((prev) =>
        Math.max(0, prev - doMesmoTreino.filter((n) => !n.lida).length)
      );
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  }

  async function handleItemClick(n) {
    if (!n.lida) {
      await handleMarcarLida(n.id);
    }
    setAberto(false);
    if (n.tipo === "graduacao") {
      const vemDoFiltroAlunos = n.id.startsWith("graduacao-");
      if (ehAluno && !vemDoFiltroAlunos) {
        navigate("/perfilAluno", { state: { id: user?.userId } });
      } else {
        navigate("/painelProfessor");
      }
    } else if (n.tipo === "aniversario") {
      navigate("/painelProfessor");
    } else {
      navigate("/meusTreinos");
    }
  }

  return (
    <div className="notification-bell" ref={ref}>
      <button
        className="bell-btn"
        onClick={() => {
          const novoEstado = !aberto;
          setAberto(novoEstado);
          if (novoEstado) carregar();
        }}
        title="Notificações"
      >
        <FaBell size={20} />
        {totalNaoLidas > 0 && <span className="bell-badge">{totalNaoLidas}</span>}
      </button>

      {aberto && (
        <div className="bell-dropdown">
          <div className="bell-header">
            <h3>Notificações</h3>
            <div className="bell-header-right">
              <button
                className={`filter-btn ${filtro !== "TODAS" ? "ativo" : ""}`}
                onClick={proximoFiltro}
                title={
                  filtro === "ALUNO"
                    ? "Filtrando: alunos"
                    : filtro === "TURMA"
                      ? "Filtrando: turmas"
                      : "Filtrar notificações"
                }
              >
                <FaFilter size={13} />
                {filtro === "ALUNO" && <span>Alunos</span>}
                {filtro === "TURMA" && <span>Turmas</span>}
              </button>
              <span className="bell-count">
                {totalNaoLidas} não lida{totalNaoLidas !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="bell-list">
            {carregando && notificacoesFiltradas.length === 0 ? (
              <p className="bell-empty">Carregando...</p>
            ) : notificacoesFiltradas.length === 0 ? (
              <p className="bell-empty">
                {filtro === "ALUNO"
                  ? "Nenhuma notificação de alunos."
                  : filtro === "TURMA"
                    ? "Nenhuma notificação de turmas."
                    : "Nenhuma notificação."}
              </p>
            ) : (
              notificacoesFiltradas.map((n) => (
                <div
                  key={n.id}
                  className={`bell-item ${n.lida ? "lida" : "nao-lida"}`}
                  onClick={() => handleItemClick(n)}
                >
                  <div className="bell-item-content">
                    <p className="bell-mensagem">{n.mensagem}</p>
                    <span className="bell-data">
                      {formatarData(n.created_at)}
                    </span>
                  </div>
                  {!n.lida && <span className="bell-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
