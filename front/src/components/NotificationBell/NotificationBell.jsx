import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import {
  listarNotificacoes,
  contarNotificacoesNaoLidas,
  marcarNotificacaoComoLida,
} from "../../services/notificacaoService";
import "./NotificationBell.css";

function formatarData(data) {
  if (!data) return "";
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function NotificationBell() {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const ref = useRef(null);

  async function carregar() {
    try {
      setCarregando(true);
      const [lista, count] = await Promise.all([
        listarNotificacoes(1, 20),
        contarNotificacoesNaoLidas(),
      ]);
      setNotificacoes(Array.isArray(lista) ? lista : []);
      setNaoLidas(count);
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
            <span className="bell-count">
              {naoLidas} não lida{naoLidas !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="bell-list">
            {carregando && notificacoes.length === 0 ? (
              <p className="bell-empty">Carregando...</p>
            ) : notificacoes.length === 0 ? (
              <p className="bell-empty">Nenhuma notificação.</p>
            ) : (
              notificacoes.map((n) => (
                <div
                  key={n.id}
                  className={`bell-item ${n.lida ? "lida" : "nao-lida"}`}
                  onClick={() => !n.lida && handleMarcarLida(n.id)}
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
