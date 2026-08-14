import React, { useState, useContext, useEffect } from "react";

import useToast from "../Toast/useToast";

import "./FrequenciaModal.css";

import {
  registrarFrequencia,
  registrarTreinoProfessor,
} from "../../services/frequenciaService";

import { listarAlunosDaTurma } from "../../services/turmaService";

import { BuscarAlunoCompletoPorUserId } from "../../services/alunoService";

import api from "../../api/axios";

import {
  buscarProfessorPorUsuarioId,
  criarProfessor,
} from "../../services/professorService";

import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const [alunos, setAlunos] = useState([]);

const { user } = useContext(AuthContext);
const { addToast } = useToast();

const [salvando, setSalvando] = useState(false);

const { mostrar } = useToast();

/*
 * Busca os alunos da turma e depois
 * busca os dados completos de cada aluno.
 */
async function carregarAlunos() {
  try {
    setCarregandoAlunos(true);

    const alunosTurma = await listarAlunosDaTurma(turmaId);

    const alunosCompletos = await Promise.all(
      alunosTurma.map(async (aluno) => {
        const alunoCompleto = await BuscarAlunoCompletoPorUserId(
          aluno.usuarioId,
        );

        return {
          /*
           * Dados completos do aluno
           */
          ...alunoCompleto,

          /*
           * Dados da relação aluno/turma
           */
          ...aluno,

          /*
           * Mantém a frequência atual
           */
          frequencia_atual: aluno.frequencia_atual,
        };
      }),
    );

    console.log("Alunos completos:", alunosCompletos);

    const alunosFrequentes = alunosCompletos.filter(
      (aluno) => aluno.frequente === "S",
    );

    console.log("Alunos frequentes:", alunosFrequentes);

    setAlunos(alunosFrequentes);
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);

    console.error("Erro ao carregar alunos:", error);

    addToast("Erro ao carregar os alunos da turma.", "error");
  } finally {
    setCarregandoAlunos(false);
  }
}

/*
 * Carrega os alunos quando o modal
 * recebe o ID da turma.
 */
useEffect(() => {
  if (!turmaId) {
    return;
  }

  carregarAlunos();
}, [turmaId]);

/*
 * Alterna a presença de um aluno.
 */
function togglePresenca(alunoId) {
  setPresentes((prev) => {
    /*
     * Se já está presente,
     * remove da lista.
     */
    if (prev.includes(alunoId)) {
      return prev.filter((id) => id !== alunoId);
    }

    /*
     * Caso contrário,
     * adiciona à lista.
     */
    return [...prev, alunoId];
  });
}

/*
 * Salva a frequência.
 */
async function handleSalvar() {
  if (salvando) {
    return;
  }

  try {
    if (!user) {
      addToast("Usuário não está logado.", "error");

      return;
    }

    if (!turmaId) {
      addToast("Turma não identificada.", "error");

      return;
    }

    setSalvando(true);

    /*
     * Busca o professor relacionado
     * ao usuário logado.
     */
    let professor;

    try {
      professor = await buscarProfessorPorUsuarioId(user.userId);
    } catch {
      /*
       * Caso o usuário ainda não tenha
       * cadastro de professor.
       */
      professor = await criarProfessor(user.userId, "PRETA", 0);
    }

    /*
     * Garante que o professor está
     * vinculado à turma.
     */
    try {
      await api.post(`turma/${turmaId}/professor`, {
        professor_id: professor.id,
      });
    } catch (error) {
      /*
       * Se já estiver vinculado,
       * simplesmente continua.
       */
      console.log("Professor já vinculado à turma.", error);
    }

    /*
     * Horário do treino.
     */
    const agora = new Date();

    const inicio = new Date(agora.getTime() - 2 * 60 * 60 * 1000);

    /*
     * Registra a frequência SOMENTE
     * dos alunos que possuem:
     *
     * frequente === "S"
     *
     * Os selecionados recebem PRESENTE.
     *
     * Os não selecionados recebem AUSENTE.
     */
    await Promise.all(
      alunos.map((aluno) => {
        const status = presentes.includes(aluno.id) ? "PRESENTE" : "AUSENTE";

        return registrarFrequencia({
          aluno_id: aluno.id,

          professor_id: professor.id,

          turma_id: turmaId,

          data: agora,

          horario_inicio: inicio,

          horario_fim: agora,

          status_presenca: status,
        });
      }),
    );

    /*
     * Registra que o professor
     * participou do treino.
     */
    await registrarTreinoProfessor(professor.id, turmaId, agora);

    addToast("Frequência registrada com sucesso!", "success");

    /*
     * Exibe a mensagem de sucesso flutuante
     * e fecha o modal após alguns segundos.
     */
    mostrar("Frequência registrada com sucesso!", "success");

    /*
     * Informa ao componente pai
     * quais alunos foram marcados
     * como presentes.
     */
    if (onSalvar) {
      onSalvar(presentes);
    }

    setTimeout(() => {
      onClose();
    }, 2500);
  } catch (error) {
    console.error(
      "Erro ao registrar frequência:",
      error.response?.data || error,
    );

    addToast("Erro ao registrar frequência.", "error");

    alert("Erro ao registrar frequência.");
  } finally {
    setSalvando(false);
  }
}

return (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2>Registrar Frequência</h2>

      <p>Selecione os alunos presentes na aula.</p>

      {carregandoAlunos ? (
        /*
         * Carregando alunos
         */
        <div
          style={{
            textAlign: "center",
            padding: "30px",
            color: "#777",
          }}
        >
          Carregando alunos...
        </div>
      ) : (
        <div className="lista-alunos">
          {alunos.length > 0 ? (
            alunos.map((aluno) => {
              const presente = presentes.includes(aluno.id);

              return (
                <div key={aluno.id} className="aluno-item">
                  <span>{aluno.nome}</span>

                  <button
                    type="button"
                    className={
                      presente ? "btn-presenca presente" : "btn-presenca"
                    }
                    onClick={() => togglePresenca(aluno.id)}
                  >
                    {presente ? "Presente" : "Marcar"}
                  </button>
                </div>
              );
            })
          ) : (
            /*
             * Caso não existam alunos
             * frequentes na turma.
             */
            <p
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#777",
              }}
            >
              Nenhum aluno frequente encontrado nesta turma.
            </p>
          )}
        </div>
      )}

      <div className="modal-buttons">
        <button
          type="button"
          className="btn-sair"
          onClick={onClose}
          disabled={salvando}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="btn-salvar"
          onClick={handleSalvar}
          disabled={carregandoAlunos || salvando || alunos.length === 0}
        >
          {salvando ? "Salvando..." : "Salvar Frequência"}
        </button>
      </div>
    </div>
  </div>
);
export default FrequenciaModal;
