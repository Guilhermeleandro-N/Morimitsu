import React, { useState, useContext, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";
import {
  registrarFrequencia,
  registrarTreinoProfessor,
} from "../../services/frequenciaService";
import { listarAlunosDaTurma } from "../../services/turmaService";
import { BuscarAlunoCompletoPorUserId } from "../../services/alunoService";
import {
  buscarProfessorPorUsuarioId,
  criarProfessor,
} from "../../services/professorService";
import api from "../../api/axios";
import "./FrequenciaModal.css";

function FrequenciaModal({ turmaId, onClose, onSalvar }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  const [alunos, setAlunos] = useState([]);
  const [presentes, setPresentes] = useState([]);
  const [carregandoAlunos, setCarregandoAlunos] = useState(true);
  const [salvando, setSalvando] = useState(false);

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
            ...alunoCompleto,
            ...aluno,
            frequencia_atual: aluno.frequencia_atual,
          };
        }),
      );

      setAlunos(alunosCompletos);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      addToast("Erro ao carregar os alunos da turma.", "error");
    } finally {
      setCarregandoAlunos(false);
    }
  }

  useEffect(() => {
    if (!turmaId) {
      return;
    }
    carregarAlunos();
  }, [turmaId]);

  function togglePresenca(alunoId) {
    setPresentes((prev) => {
      if (prev.includes(alunoId)) {
        return prev.filter((id) => id !== alunoId);
      }
      return [...prev, alunoId];
    });
  }

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

      let professor;
      try {
        professor = await buscarProfessorPorUsuarioId(user.userId);
      } catch {
        professor = await criarProfessor(user.userId, "PRETA", 0);
      }

      try {
        await api.post(`turma/${turmaId}/professor`, {
          professor_id: professor.id,
        });
      } catch (error) {
        console.log("Professor já vinculado à turma.", error);
      }

      const agora = new Date();
      const inicio = new Date(agora.getTime() - 2 * 60 * 60 * 1000);

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

      await registrarTreinoProfessor(professor.id, turmaId, agora);

      addToast("Frequência registrada com sucesso!", "success");

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
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#777",
                }}
              >
                Nenhum aluno encontrado nesta turma.
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
}

export default FrequenciaModal;
