import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
function ProtectedRoute({children, rolesPermitidas}){
    const token = localStorage.getItem("accessToken");
    const {user} = useContext(AuthContext)
    if (!user){
        return <Navigate to="/login"/>
    }

    if (user.roles.some(papel => rolesPermitidas.includes(papel))){
        return children;
    }
    console.log("Não permitido")
    return <Navigate to="/"/>
}

export default ProtectedRoute;