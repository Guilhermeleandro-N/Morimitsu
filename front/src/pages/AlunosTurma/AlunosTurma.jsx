import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listarAlunosDaTurma } from "../../services/turmaService";
import { BuscarAlunoCompletoPorUserId } from "../../services/alunoService";

import {
  FaEye,
  FaTrash,
  FaArchive,
  FaUserPlus,
  FaClipboardCheck
} from "react-icons/fa";

import "./AlunosTurma.css";

function AlunosTurma() {

  const navigate = useNavigate();
  const location = useLocation();

  const turmaId = location.state?.turmaId;
  const turmaNome = location.state?.turmaNome;

  const [alunos, setAlunos] = useState([]);

  function abrirPerfil(userId) {
    navigate("/perfilAluno", {
      state: {
        id: userId,
      },
    });
  }

  useEffect(() => {

    async function carregarAlunos() {
      try {

        const alunosTurma = await listarAlunosDaTurma(turmaId);

        const alunosCompletos = await Promise.all(
          alunosTurma.map(async (aluno) => {
            const alunoCompleto =
              await BuscarAlunoCompletoPorUserId(
                aluno.usuarioId
              );

            return {
              ...aluno,
              ...alunoCompleto
            };
          })
        );

        console.log("Alunos completos:", alunosCompletos);

        setAlunos(alunosCompletos);

      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      }
    }

    if (turmaId) {
      carregarAlunos();
    }

  }, [turmaId]);

  function getFaixaClass(faixa) {

    switch (faixa?.toLowerCase()) {

      case "branca":
        return "faixa branca";

      case "amarela":
        return "faixa amarela";

      case "laranja":
        return "faixa laranja";

      case "verde":
        return "faixa verde";

      case "azul":
        return "faixa azul";

      default:
        return "faixa";
    }
  }

  return (
    <div className="listar-container">

      <div className="page-header">

        <div>

          <h1>Lista de Alunos</h1>

          <p>
            Gerenciar alunos da turma {turmaNome}
          </p>

        </div>

        <div className="header-actions">

          <button
            className="header-btn"
            onClick={() =>
              console.log("Adicionar aluno")
            }
          >
            <FaUserPlus />
          </button>

          <button
            className="header-btn"
            onClick={() =>
              console.log("Realizar frequência")
            }
          >
            <FaClipboardCheck />
          </button>

        </div>

      </div>

      <div className="listar-card">

        <div className="listar-header">

          <h2>
            {turmaNome}
          </h2>

          <p>
            Total de {alunos.length} alunos nesta turma
          </p>

        </div>

        <div className="table-container">

          <table className="tabela-alunos">

            <thead>
              <tr>
                <th>Nome</th>
                <th>Faixa</th>
                <th>Grau</th>
                <th>Frequência</th>
                <th>Status</th>
                <th>Arquivar</th>
                <th>Excluir</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              {alunos.map((aluno) => (

                <tr key={aluno.id}>

                  <td className="nome-aluno">
                    {aluno.nome}
                  </td>

                  <td>
                    <span
                      className={getFaixaClass(aluno.faixa)}
                    >
                      {aluno.faixa}
                    </span>
                  </td>

                  <td>
                    {aluno.grau_faixa}
                  </td>

                  <td>
                    {aluno.frequencia_atual}
                  </td>

                  <td>

                    <span
                      className={
                        aluno.frequente === "S"
                          ? "status ativo"
                          : "status inativo"
                      }
                    >
                      {aluno.frequente === "S"
                        ? "Ativo"
                        : "Inativo"}
                    </span>

                  </td>

                  <td>

                    <button className="icon-btn">
                      <FaArchive />
                    </button>

                  </td>

                  <td>

                    <button className="icon-btn delete">
                      <FaTrash />
                    </button>

                  </td>

                  <td>

                    <button
                      className="perfil-btn"
                      onClick={() =>
                        abrirPerfil(aluno.usuarioId)
                      }
                    >
                      <FaEye />
                      Ver Perfil
                    </button>

                  </td>

                </tr>

              ))}

              {alunos.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px"
                    }}
                  >
                    Nenhum aluno encontrado.
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

export default AlunosTurma;