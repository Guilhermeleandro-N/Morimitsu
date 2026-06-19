import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listarAlunosCompleto } from "../../services/alunoService";

import "./AdicionarAlunoTurmaModal.css";

function AdicionarAlunoTurmaModal({
  turmaId,
  turmaNome,
  onClose
}) {

  const navigate = useNavigate();

  const [modo, setModo] =
    useState("existente");

  const [alunos, setAlunos] =
    useState([]);

  const [alunosSelecionados,
    setAlunosSelecionados] =
    useState([]);
  const [busca, setBusca] =
    useState("");

  useEffect(() => {

    async function carregar() {

      const response =
        await listarAlunosCompleto();

      setAlunos(response);

    }

    carregar();

  }, []);

  async function adicionarAluno() {

    if (!alunoSelecionado) return;

    try {

      // await vincularAlunoTurma(
      //   alunoSelecionado,
      //   turmaId
      // );

      onClose();

    } catch (error) {

      console.log(error);

    }

  }

  function cadastrarNovoAluno() {

    navigate("/cadastrarAluno", {
      state: {
        turmaId,
        turmaNome
      }
    });

  }
  const alunosFiltrados = alunos.filter(
    (aluno) =>
      aluno.usuario.nome
        .toLowerCase()
        .includes(busca.toLowerCase())
  );

  function toggleAluno(id) {

    if (
      alunosSelecionados.includes(id)
    ) {

      setAlunosSelecionados(
        alunosSelecionados.filter(
          alunoId => alunoId !== id
        )
      );

    } else {

      setAlunosSelecionados([
        ...alunosSelecionados,
        id
      ]);

    }

  }
  return (

    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-top">

          <h2>Adicionar Aluno</h2>

          <p>
            Adicionar aluno a uma turma
          </p>

        </div>

        <h3 className="pergunta">
          Quem você quer adicionar?
        </h3>

        <div className="tipo-selector">

          <button
            className={
              modo === "existente"
                ? "active"
                : ""
            }
            onClick={() =>
              setModo("existente")
            }
          >
            Aluno Existente
          </button>

          <button
            className={
              modo === "novo"
                ? "active"
                : ""
            }
            onClick={() =>
              setModo("novo")
            }
          >
            Novo Aluno
          </button>

        </div>

        {modo === "existente" && (

          <div className="form-area">

            <label>Aluno</label>

            <input
              className="busca-input"
              type="text"
              placeholder="Pesquisar aluno..."
              value={busca}
              onChange={(e) =>
                setBusca(e.target.value)
              }
            />

            <div className="lista-alunos">

              {alunosFiltrados.map((aluno) => (

                <div
                  key={aluno.id}
                  className="aluno-item"
                >

                  <input
                    type="checkbox"
                    checked={
                      alunosSelecionados.includes(
                        aluno.id
                      )
                    }
                    onChange={() =>
                      toggleAluno(aluno.id)
                    }
                  />

                  <label
                    htmlFor={`aluno-${aluno.id}`}
                  >
                    {aluno.usuario.nome}
                  </label>

                </div>

              ))}

            </div>

          </div>

        )}

        {modo === "novo" && (

          <div className="novo-aluno-info">

            O aluno será cadastrado e
            vinculado automaticamente à
            turma.

          </div>

        )}

        <div className="modal-buttons">

          <button
            className="btn-sair"
            onClick={onClose}
          >
            Sair
          </button>

          {modo === "existente" ? (

            <button
              className="btn-salvar"
              onClick={adicionarAluno}
            >
              Adicionar Aluno
            </button>

          ) : (

            <button
              className="btn-salvar"
              onClick={
                cadastrarNovoAluno
              }
            >
              Cadastrar Aluno
            </button>

          )}

        </div>

      </div>

    </div>

  );

}

export default AdicionarAlunoTurmaModal;