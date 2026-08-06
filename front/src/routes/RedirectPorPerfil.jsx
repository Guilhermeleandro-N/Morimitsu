import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Redireciona o usuário logado para a tela adequada ao seu perfil.
function RedirectPorPerfil() {
  const { user } = useContext(AuthContext);

  if (user?.roles?.includes("admin") || user?.roles?.includes("professor")) {
    return <Navigate to="/turmas" replace />;
  }

  if (user?.roles?.includes("aluno")) {
    return <Navigate to="/perfilAluno" replace />;
  }

  return <Navigate to="/turmas" replace />;
}

export default RedirectPorPerfil;
