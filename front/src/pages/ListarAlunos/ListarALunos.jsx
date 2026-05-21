import React, { useEffect, useState } from "react";
import { listarAlunoCompleto } from "../../services/alunoService";

import {
  FaEye,
  FaTrash,
  FaArchive,
} from "react-icons/fa";

import "./ListarAlunos.css";

const ListarAluno = () => {

  const [alunos, setAlunos] = useState([]);

  useEffect(() => {

    async function carregarAlunos() {
      try {

        const response = await listarAlunoCompleto();

        setAlunos(response);

      } catch (error) {
        console.log("Erro ao carregar alunos:", error);
      }
    }

    carregarAlunos();

  }, []);

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

      <div className="listar-card">

        <div className="listar-header">
          <h2>Alunos Cadastrados</h2>

          <p>
            Total de {alunos.length} alunos
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
                    {aluno.usuario.nome}
                  </td>

                  <td>
                    <span className={getFaixaClass(aluno.faixa)}>
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
                        aluno.usuario.status === "ENABLED"
                          ? "status ativo"
                          : "status inativo"
                      }
                    >
                      {aluno.usuario.status === "ENABLED"
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
                    <button className="perfil-btn">
                      <FaEye />
                      Ver Perfil
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ListarAluno;