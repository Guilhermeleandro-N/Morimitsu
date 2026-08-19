import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SessionExpiredOverlay.css";

const EVENTO_SESSAO_EXPIRADA = "session-expired";

function SessionExpiredOverlay() {
  const navigate = useNavigate();
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function aoSessaoExpirar() {
      setVisivel(true);
      window.setTimeout(() => {
        setVisivel(false);
        navigate("/login", { replace: true });
      }, 1000);
    }

    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoSessaoExpirar);
    return () =>
      window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoSessaoExpirar);
  }, [navigate]);

  if (!visivel) return null;

  return (
    <div className="session-expired-overlay">
      <div className="session-expired-card">
        <div className="session-expired-spinner" />
        <p>Sua sessão expirou. Voltando para a tela de login...</p>
      </div>
    </div>
  );
}

export default SessionExpiredOverlay;
