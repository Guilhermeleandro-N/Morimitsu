import {useState} from "react";
import "./Sidebar.css";
import logo from "../../assets/morimitsu.png";
import { useNavigate } from "react-router-dom";
function Sidebar({isOpen, setIsOpen}) {
    const user = "Saulo"
    console.log(isOpen)
    const navigate = useNavigate()
    return (
            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}` }> 
            
            <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕  
            </button>
            <div className='nome-logo'>
                    <img src={logo} alt="logo" />
                    <div className="nome-logo-text">
                      <span className="titulo">Morimitsu</span>
                      <span className="subtitulo">{user}</span>
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
                    <li>
                        Ver Alunos
                    </li>
                    <li>
                        Cadastrar Turma
                    </li>
                    <li>
                        Ver Turmas
                    </li>
                </ul>
            </nav>
            <button className="logout-btn"  >Sair</button>
            </aside>
    )
}

export default Sidebar;