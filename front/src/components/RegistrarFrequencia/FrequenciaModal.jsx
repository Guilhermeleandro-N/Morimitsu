import React, {
  useState,
  useContext
} from "react";

import "./FrequenciaModal.css";

import {
  registrarFrequencia
} from "../../services/frequenciaService";

import api from "../../api/axios";

import {
  buscarProfessorPorUsuarioId,
  criarProfessor,
} from "../../services/professorService";

import {
  AuthContext
} from "../../context/AuthContext";

const FrequenciaModal = ({
  alunos,
  turmaId,
  onClose,
  onSalvar,
}) => {

  const { user } =
    useContext(AuthContext);

  const [presentes, setPresentes] =
    useState([]);

  function togglePresenca(alunoId) {

    setPresentes((prev) =>
      prev.includes(alunoId)
        ? prev.filter(
            (id) => id !== alunoId
          )
        : [...prev, alunoId]
    );

  }

  async function handleSalvar() {

    try {

      if (!user) {
        alert("Usuário não está logado.");
        return;
      }

      let professor;
      try {
        professor = await buscarProfessorPorUsuarioId(user.userId);
      } catch {
        // Admin pode não ter registro de Professor — cria na hora
        professor = await criarProfessor(user.userId, "PRETA", 0);
      }

      // Garante que o professor está vinculado à turma
      try {
        await api.post(`turma/${turmaId}/professor`, {
          professor_id: professor.id,
        });
      } catch {
        // Já vinculado, ignora
      }

      const agora = new Date();

      const inicio = new Date(
        agora.getTime() -
          2 * 60 * 60 * 1000
      );

      await Promise.all(

        alunos.map((aluno) =>
          
          registrarFrequencia({

            aluno_id: aluno.id,

            professor_id: professor.id,

            turma_id: turmaId,

            data: agora,

            horario_inicio: inicio,

            horario_fim: agora,

            status_presenca: presentes.includes(aluno.id)
              ? "PRESENTE"
              : "AUSENTE",

          })

          
        )
        
      );

      alert(
        "Frequência registrada com sucesso!"
      );

      if (onSalvar) {
        onSalvar(presentes);
      }

      onClose();

    } catch (error) {

      console.error(
        "Erro ao registrar frequência:",
        error.response?.data || error
      );

      alert(
        "Erro ao registrar frequência."
      );

    }

  }

  return (

    <div className="modal-overlay">

      <div className="modal-container">

        <h2>
          Registrar Frequência
        </h2>

        <p>
          Selecione os alunos presentes na aula.
        </p>

        <div className="lista-alunos">

          {alunos.map((aluno) => (

            <div
              key={aluno.id}
              className="aluno-item"
            >

              <span>
                {aluno.nome}
              </span>

              <button
                className={
                  presentes.includes(
                    aluno.id
                  )
                    ? "btn-presenca presente"
                    : "btn-presenca"
                }
                onClick={() =>
                  togglePresenca(
                    aluno.id
                  )
                }
              >
                {presentes.includes(
                  aluno.id
                )
                  ? "Presente"
                  : "Marcar"}
              </button>

            </div>

          ))}

        </div>

        <div className="modal-buttons">

          <button
            className="btn-sair"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="btn-salvar"
            onClick={handleSalvar}
          >
            Salvar Frequência
          </button>

        </div>

      </div>

    </div>

  );

};

export default FrequenciaModal;