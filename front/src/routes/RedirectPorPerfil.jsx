import { Navigate } from "react-router-dom";

// Redireciona o usuário logado para a tela inicial (Meus Treinos).
function RedirectPorPerfil() {
  return <Navigate to="/meusTreinos" replace />;
}

export default RedirectPorPerfil;
