import React, { useState } from "react";
import "./FrequenciaModal.css";
import { registrarFrequencia } from "../../services/frequenciaService";

const FrequenciaModal = ({
  alunos,
  turmaId,
  onClose,
  onSalvar,
}) => {

  const [presentes, setPresentes] =
    useState([]);

  const togglePresenca = (alunoId) => {

    setPresentes((prev) =>
      prev.includes(alunoId)
        ? prev.filter(
            (id) => id !== alunoId
          )
        : [...prev, alunoId]
    );

  };

  const handleSalvar = async () => {

    try {

      const agora = new Date();

      const inicio = new Date(
        agora.getTime() -
          2 * 60 * 60 * 1000
      );

      await Promise.all(

        presentes.map((alunoId) =>

          registrarFrequencia({
            aluno_id: alunoId,

            professor_id:
              "1eba4e87-d72a-4a94-b81a-a1b8b27f8330",

            turma_id: turmaId,

            data: agora,

            horario_inicio: inicio,

            horario_fim: agora,

            status_presenca:
              "PRESENTE",
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
        error.response?.data ||
          error
      );

      alert(
        "Erro ao registrar frequência."
      );

    }

  };

  return (

    <div className="modal-overlay">

      <div className="modal-container">

        <h2>
          Registrar Frequência
        </h2>

        <p>
          Selecione os alunos
          presentes na aula.
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