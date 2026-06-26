import {useState} from "react";
import "./Sidebar.css";
import logo from "../../assets/morimitsu.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import RoleGuard from "../../routes/RoleGuard";
function Sidebar({isOpen, setIsOpen}) {

    const {user} = useContext(AuthContext)
    const {logout} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate("login");
    }

    let nome;
    if (!user){
        nome = "Saulo";
     }else{
         nome = user.nome;
    }


    return (
            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}` }> 
            
            <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕  
            </button>
            <div className='nome-logo'>
                    <img src={logo} alt="logo" />
                    <div className="nome-logo-text">
                      <span className="titulo">Morimitsu</span>
                      <span className="subtitulo">{nome}</span>
                    </div>
                  </div>
            <nav>
                <ul>
                    <RoleGuard allowedRoutes={["admin", "professor"]} >
                    <li onClick={()=> {navigate("cadastrarAluno")}}  >
                        Cadastrar Aluno
                    </li>
                    </RoleGuard>
                    
                    <li onClick={()=> {navigate("Turmas")}}>
                        Turmas
                    </li>
                    
                    <RoleGuard allowedRoutes={["admin", "professor"]} >
                    <li onClick={()=> {navigate("listarAluno")}}>
                        Lista de Alunos
                    </li>
                    </RoleGuard>

                    <li onClick={()=> {navigate("teste")}}  >
                        teste
                    </li>

                                        <RoleGuard allowedRoutes={["admin"]} >
                    <li onClick={()=> {navigate("/listarProfessores")}}  >
                        Lista de professores
                    </li>
                    </RoleGuard>

                </ul>
            </nav>
            <button className="logout-btn"  onClick= {handleLogout} >Sair</button>
            </aside>
    )
}

export default Sidebar;