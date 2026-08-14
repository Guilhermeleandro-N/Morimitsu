import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFilter } from "react-icons/fa";
import {
  listarNotificacoes,
  contarNotificacoesNaoLidas,
  marcarNotificacaoComoLida,
} from "../../services/notificacaoService";
import { buscarDashboardProfessor } from "../../services/professorService";
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
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [filtro, setFiltro] = useState("TODAS");
  const [painelAvisos, setPainelAvisos] = useState([]);
  const ref = useRef(null);

  function proximoFiltro() {
    const idx = FILTROS.indexOf(filtro);
    setFiltro(FILTROS[(idx + 1) % FILTROS.length]);
  }

  async function carregarAvisosPainel() {
    try {
      const data = await buscarDashboardProfessor();
      const avisos = [];
      (data?.proximos_graduacao || []).forEach((g) => {
        avisos.push({
          id: `graduacao-${g.aluno_id}`,
          mensagem:
            g.frequencias_restantes === 0
              ? `O aluno ${g.nome} já deve ser graduado`
              : `Falta ${g.frequencias_restantes} frequência${
                  g.frequencias_restantes === 1 ? "" : "s"
                } para o aluno ${g.nome} se graduar`,
          tipo: "graduacao",
          lida: true,
          created_at: new Date().toISOString(),
        });
      });
      (data?.proximos_aniversario || []).forEach((a) => {
        avisos.push({
          id: `aniversario-${a.aluno_id}`,
          mensagem:
            a.dias_restantes === 0
              ? `Hoje é o aniversário de ${a.nome}!`
              : `O aniversário de ${a.nome} é em ${a.dias_restantes} dia${
                  a.dias_restantes === 1 ? "" : "s"
                }!`,
          tipo: "aniversario",
          lida: true,
          created_at: new Date().toISOString(),
        });
      });
      setPainelAvisos(avisos);
    } catch (error) {
      console.error("Erro ao carregar avisos do painel:", error);
      setPainelAvisos([]);
    }
  }

  const notificacoesFiltradas = useMemo(() => {
    if (filtro === "ALUNO") {
      return painelAvisos;
    }
    if (filtro === "TURMA") {
      return notificacoes.filter((n) => n.tipo === "treino");
    }
    return [...notificacoes, ...painelAvisos];
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
      await carregarAvisosPainel();
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
    try {
      await marcarNotificacaoComoLida(id);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
      setNaoLidas((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  }

  async function handleItemClick(n) {
    if (!n.lida) {
      await handleMarcarLida(n.id);
    }
    setAberto(false);
    if (n.tipo === "graduacao" || n.tipo === "aniversario") {
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
        {naoLidas > 0 && <span className="bell-badge">{naoLidas}</span>}
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
                {naoLidas} não lida{naoLidas !== 1 ? "s" : ""}
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
