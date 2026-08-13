import "./Sidebar.css";
import logo from "../../assets/morimitsu.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import RoleGuard from "../../routes/RoleGuard";
import {
  UserRoundPlus,
  UserRound,
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  Archive,
  LogOut,
  X,
  CalendarClock,
} from "lucide-react";
function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("login");
  };

  function abrirMeuPerfil() {
    if (!user) return;
    const roles = user.roles || [];
    if (roles.includes("professor")) {
      navigate("/perfilProfessor", { state: { id: user.userId } });
    } else if (roles.includes("aluno")) {
      navigate("/perfilAluno", { state: { id: user.userId } });
    } else {
      navigate("/perfilProfessor", { state: { id: user.userId } });
    }
  }

  let nome;
  if (!user) {
    nome = "Saulo";
  } else {
    nome = user.nome;
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="close-btn" onClick={() => setIsOpen(false)}>
        <X size={24} />
      </button>
      <div className="nome-logo">
        <img src={logo} alt="logo" />
        <div className="nome-logo-text">
          <span className="titulo">Morimitsu</span>
          <span className="subtitulo">{nome}</span>
        </div>
      </div>
      <nav>
        <RoleGuard allowedRoutes={["admin", "professor"]}>
          <ul className="nav-section">
            <li
              onClick={() => {
                navigate("listarAluno");
              }}
            >
              <Users size={22} className="menu-icon" />
              <span>Lista de Alunos</span>
            </li>

            <RoleGuard allowedRoutes={["admin"]}>
              <li
                onClick={() => {
                  navigate("/listarProfessores");
                }}
              >
                <GraduationCap size={22} className="menu-icon" />
                <span>Lista de Professores</span>
              </li>
            </RoleGuard>

            <li
              onClick={() => {
                navigate("/painelProfessor");
              }}
            >
              <LayoutDashboard size={22} className="menu-icon" />
              <span>Painel</span>
            </li>

            <li
              onClick={() => {
                navigate("cadastros");
              }}
            >
              <UserRoundPlus size={22} className="menu-icon" />
              <span>Cadastros</span>
            </li>
          </ul>

          <div className="nav-divider" />
        </RoleGuard>

        <ul className="nav-section">
          <RoleGuard allowedRoutes={["admin", "professor", "aluno"]}>
            <li
              onClick={() => {
                navigate("Turmas");
              }}
            >
              <GraduationCap size={22} className="menu-icon" />
              <span>Minhas Turmas</span>
            </li>
          </RoleGuard>

          <RoleGuard
            allowedRoutes={["admin", "professor", "aluno"]}
            permissoes={["screen.treino.visualizar"]}
          >
            <li
              onClick={() => {
                navigate("/meusTreinos");
              }}
            >
              <CalendarClock size={22} className="menu-icon" />
              <span>Meus Treinos</span>
            </li>
          </RoleGuard>

          <RoleGuard allowedRoutes={["admin", "professor"]}>
            <li
              onClick={() => {
                navigate("/turmasArquivadas");
              }}
            >
              <Archive size={22} className="menu-icon" />
              <span>Turmas Arquivadas</span>
            </li>
          </RoleGuard>
        </ul>

        <div className="nav-divider" />

        <ul className="nav-section">
          <RoleGuard allowedRoutes={["admin", "professor", "aluno"]}>
            <li onClick={abrirMeuPerfil}>
              <UserRound size={22} className="menu-icon" />
              <span>Meu Perfil</span>
            </li>
          </RoleGuard>

          <RoleGuard allowedRoutes={["admin"]}>
            <li
              onClick={() => {
                navigate("/concederPermissoes");
              }}
            >
              <ShieldCheck size={22} className="menu-icon" />
              <span>Conceder Permissões</span>
            </li>
          </RoleGuard>
        </ul>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={22} className="menu-icon" />
        <span>Sair</span>
      </button>
    </aside>
  );
}

export default Sidebar;
