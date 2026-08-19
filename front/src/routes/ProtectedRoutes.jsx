import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SemAcesso from "../pages/SemAcesso/SemAcesso";
import AccessDenied from "../pages/AccessDenied/AccessDenied";

function ProtectedRoute({
  children,
  rolesPermitidas = [],
  permissoesNecessarias = [],
}) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Usuário sem nenhum perfil (nem professor, nem aluno, nem admin)
  if (!user.roles || user.roles.length === 0) {
    return <SemAcesso />;
  }

  // Admin tem acesso total
  if (user.roles.includes("admin")) {
    return children;
  }

  const temPapel =
    rolesPermitidas.length === 0 ||
    user.roles.some((papel) => rolesPermitidas.includes(papel));

  if (!temPapel) {
    return <AccessDenied />;
  }

  const temPermissao =
    permissoesNecessarias.length === 0 ||
    (user.permissoes || []).some((p) => permissoesNecessarias.includes(p));

  if (!temPermissao) {
    return <AccessDenied />;
  }

  return children;
}

export default ProtectedRoute;
