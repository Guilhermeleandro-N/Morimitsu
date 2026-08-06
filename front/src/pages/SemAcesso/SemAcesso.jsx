import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldOff, LogOut } from "lucide-react";
import "./SemAcesso.css";

const SemAcesso = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleSair() {
    logout();
    navigate("/login");
  }

  return (
    <div className="sem-acesso-container">
      <div className="sem-acesso-card">
        <div className="sem-acesso-icon">
          <ShieldOff size={42} />
        </div>
        <h2>Olá, {user?.nome || "usuário"}!</h2>
        <p>Você ainda não possui acesso, peça a alguém para lhe cadastrar.</p>
        <button className="sem-acesso-btn" onClick={handleSair}>
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </div>
  );
};

export default SemAcesso;
