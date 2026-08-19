import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import "./AccessDenied.css";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <ShieldX size={42} />
        </div>
        <h2>Acesso negado</h2>
        <p>Você não tem permissão para acessar esta tela.</p>
        <button className="access-denied-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
