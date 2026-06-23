import { useEffect, useState } from "react";

import { listarAlunosCompleto } from "../../services/alunoService";
import { listarProfessores } from "../../services/professorService";

import {
  adicionarAlunoNaTurma,
  adicionarProfessorTurma,
} from "../../services/turmaService";

import "./AdicionarAlunoTurmaModal.css";

function AdicionarAlunoTurmaModal({
  turmaId,
  turmaNome,
  onClose,
  onAlunoAdicionado,
}) {
  const [modo, setModo] =
    useState("aluno");

  const [alunos, setAlunos] =
    useState([]);

  const [professores, setProfessores] =
    useState([]);

  const [alunosSelecionados,
    setAlunosSelecionados] =
    useState([]);

  const [professoresSelecionados,
    setProfessoresSelecionados] =
    useState([]);

  const [busca, setBusca] =
    useState("");

  const [buscaProfessor,
    setBuscaProfessor] =
    useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const alunosResponse =
          await listarAlunosCompleto();

        setAlunos(alunosResponse);

        const professoresResponse =
          await listarProfessores();

        setProfessores(
          professoresResponse
        );
      } catch (error) {
        console.error(
          "Erro ao carregar dados:",
          error
        );
      }
    }

    carregar();
  }, []);

  async function adicionarAluno() {
    if (
      alunosSelecionados.length === 0
    ) {
      alert(
        "Selecione pelo menos um aluno."
      );
      return;
    }

    try {
      await Promise.all(
        alunosSelecionados.map(
          (alunoId) =>
            adicionarAlunoNaTurma(
              turmaId,
              alunoId,
              "S"
            )
        )
      );

      alert(
        "Aluno(s) adicionado(s) com sucesso!"
      );

      if (onAlunoAdicionado) {
        await onAlunoAdicionado();
      } else {
        onClose();
      }
    } catch (error) {
      console.error(
        "Erro ao adicionar aluno:",
        error
      );

      alert(
        "Erro ao adicionar aluno."
      );
    }
  }

  async function adicionarProfessor() {
    if (
      professoresSelecionados.length === 0
    ) {
      alert(
        "Selecione pelo menos um professor."
      );
      return;
    }

    try {
      await Promise.all(
        professoresSelecionados.map(
          (professorId) =>
            adicionarProfessorTurma(
              turmaId,
              professorId
            )
        )
      );

      alert(
        "Professor(es) adicionado(s) com sucesso!"
      );

      if (onAlunoAdicionado) {
        await onAlunoAdicionado();
      } else {
        onClose();
      }
    } catch (error) {
      console.error(
        "Erro ao adicionar professor:",
        error
      );

      alert(
        "Erro ao adicionar professor."
      );
    }
  }

  function toggleAluno(id) {
    if (
      alunosSelecionados.includes(id)
    ) {
      setAlunosSelecionados(
        alunosSelecionados.filter(
          (alunoId) =>
            alunoId !== id
        )
      );
    } else {
      setAlunosSelecionados([
        ...alunosSelecionados,
        id,
      ]);
    }
  }

  function toggleProfessor(id) {
    if (
      professoresSelecionados.includes(
        id
      )
    ) {
      setProfessoresSelecionados(
        professoresSelecionados.filter(
          (professorId) =>
            professorId !== id
        )
      );
    } else {
      setProfessoresSelecionados([
        ...professoresSelecionados,
        id,
      ]);
    }
  }

  const alunosFiltrados =
    alunos.filter((aluno) =>
      aluno.usuario?.nome
        ?.toLowerCase()
        .includes(
          busca.toLowerCase()
        )
    );

  const professoresFiltrados =
    professores.filter(
      (professor) =>
        professor.nome
          ?.toLowerCase()
          .includes(
            buscaProfessor.toLowerCase()
          )
    );

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <div className="modal-top">
          <h2>
            Gerenciar Participantes
          </h2>

          <p>
            Turma: {turmaNome}
          </p>
        </div>

        <h3 className="pergunta">
          O que deseja adicionar?
        </h3>

        <div className="tipo-selector">

          <button
            className={
              modo === "aluno"
                ? "active"
                : ""
            }
            onClick={() =>
              setModo("aluno")
            }
          >
            Alunos
          </button>

          <button
            className={
              modo === "professor"
                ? "active"
                : ""
            }
            onClick={() =>
              setModo("professor")
            }
          >
            Professores
          </button>

        </div>

        {modo === "aluno" && (
          <div className="form-area">

            <label>
              Alunos
            </label>

            <input
              className="busca-input"
              type="text"
              placeholder="Pesquisar aluno..."
              value={busca}
              onChange={(e) =>
                setBusca(
                  e.target.value
                )
              }
            />

            <div className="lista-alunos">

              {alunosFiltrados.map(
                (aluno) => (
                  <div
                    key={aluno.id}
                    className="aluno-item"
                  >

                    <input
                      type="checkbox"
                      checked={alunosSelecionados.includes(
                        aluno.id
                      )}
                      onChange={() =>
                        toggleAluno(
                          aluno.id
                        )
                      }
                    />

                    <label>
                      {
                        aluno.usuario
                          ?.nome
                      }
                    </label>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {modo === "professor" && (
          <div className="form-area">

            <label>
              Professores
            </label>

            <input
              className="busca-input"
              type="text"
              placeholder="Pesquisar professor..."
              value={
                buscaProfessor
              }
              onChange={(e) =>
                setBuscaProfessor(
                  e.target.value
                )
              }
            />

            <div className="lista-alunos">

              {professoresFiltrados.map(
                (professor) => (
                  <div
                    key={
                      professor.id
                    }
                    className="aluno-item"
                  >

                    <input
                      type="checkbox"
                      checked={professoresSelecionados.includes(
                        professor.id
                      )}
                      onChange={() =>
                        toggleProfessor(
                          professor.id
                        )
                      }
                    />

                    <label>
                      {
                        professor.nome
                      }
                    </label>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        <div className="modal-buttons">

          <button
            className="btn-sair"
            onClick={onClose}
          >
            Sair
          </button>

          {modo === "aluno" ? (
            <button
              className="btn-salvar"
              onClick={
                adicionarAluno
              }
            >
              Adicionar Aluno
            </button>
          ) : (
            <button
              className="btn-salvar"
              onClick={
                adicionarProfessor
              }
            >
              Adicionar Professor
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdicionarAlunoTurmaModal;