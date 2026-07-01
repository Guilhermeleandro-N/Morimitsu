import React, {
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
  listarProfessores
} from "../../services/professorService";

import {
  FaEye
} from "react-icons/fa";

import "./ListarProfessores.css";

function ListarProfessores() {
  
const navigate = useNavigate();

function abrirPerfil(userId) {

  navigate("/perfilProfessor", {
    state: {
      id: userId
    }
  });

}


  const [professores,
    setProfessores] =
    useState([]);

  async function carregarProfessores() {

    try {

      const response =
        await listarProfessores();

      setProfessores(response);

    } catch (error) {

      console.error(
        "Erro ao carregar professores:",
        error
      );

    }

  }

  useEffect(() => {

    carregarProfessores();

  }, []);

  return (

    <div className="listar-container">

      <div className="page-header">

        <div>

          <h1>
            Lista de Professores
          </h1>

          <p>
            Professores cadastrados na plataforma
          </p>

        </div>

      </div>

      <div className="listar-card">

        <div className="listar-header">

          <h2>
            Professores
          </h2>

          <p>
            Total de {professores.length}
            {" "}professores cadastrados
          </p>

        </div>

        <div className="table-container">

          <table className="tabela-alunos">

            <thead>

              <tr>

                <th>Nome</th>
                <th>Email</th>
                <th>Faixa</th>
                <th>Grau</th>
                <th>Ações</th>

              </tr>

            </thead>

            <tbody>

              {professores.map(
                (professor) => (

                  <tr
                    key={professor.id}
                  >

                    <td>
                      {professor.nome}
                    </td>

                    <td>
                      {professor.email}
                    </td>

                    <td>
                      {professor.faixa}
                    </td>

                    <td>
                      {professor.grau}
                    </td>

                    <td>

                      <button
                        className="perfil-btn"
                        onClick={() =>
                          abrirPerfil(professor.usuarioId)
                        }
                      >
                        <FaEye />
                        Ver Perfil
                      </button>

                    </td>

                  </tr>

                )
              )}

              {professores.length === 0 && (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "20px"
                    }}
                  >
                    Nenhum professor encontrado.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default ListarProfessores;