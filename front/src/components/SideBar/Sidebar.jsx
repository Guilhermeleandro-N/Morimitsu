import {useState} from "react";
import "./Sidebar.css";
import logo from "../../assets/morimitsu.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
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
                    <li onClick={()=> {navigate("cadastrarAluno")}}  >
                        Cadastrar Aluno
                    </li>
                    <li onClick={()=> {navigate("editarAluno")}} >
                        Editar Aluno
                    </li>
                    <li onClick={()=> {navigate("perfilAluno")}} >
                        Ver Perfil
                    </li>
                    <li>
                        Cadastrar Turma
                    </li>
                    <li onClick={()=> {navigate("Turmas")}}>
                        Turmas
                    </li>
                    <li onClick={()=> {navigate("listarAluno")}}>
                        Lista de Alunos
                    </li>
                </ul>
            </nav>
            <button className="logout-btn"  onClick= {handleLogout} >Sair</button>
            </aside>
    )
}

export default Sidebar;