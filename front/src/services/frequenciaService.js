import api from "../api/axios";
import { buscarProfessorPorUsuarioId } from "./professorService";

export async function registrarFrequencia(frequencia) {
  try {
    const response = await api.post("/frequencia", frequencia);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar frequência:", error);
    throw error;
  }
}

export async function registrarFrequenciaTurma(usuarioId, turmaId, alunosPresentes) {
  try {
    const professor = await buscarProfessorPorUsuarioId(usuarioId);
    const agora = new Date();
    const inicio = new Date(agora.getTime() - 2 * 60 * 60 * 1000);

    const promessas = alunosPresentes.map((alunoId) =>
      registrarFrequencia({
        aluno_id: alunoId,
        professor_id: professor.id,
        turma_id: turmaId,
        data: agora,
        horario_inicio: inicio,
        horario_fim: agora,
        status_presenca: "PRESENTE",
      })
    );
    return await Promise.all(promessas);
  } catch (error) {
    console.error("Erro ao registrar frequência da turma:", error);
    throw error;
  }
}

export async function listarFrequenciasAluno(alunoId) {
  try {
    const response = await api.get(`/frequencia/aluno/${alunoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar frequências do aluno:", error);
    throw error;
  }
}

export async function listarFrequenciasTurma(turmaId) {
  try {
    const response = await api.get(`/frequencia/turma/${turmaId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar frequências da turma:", error);
    throw error;
  }
}

export async function relatorioTreino(turmaId, alunosPresentes) {
  try {
    const response = await api.post("frequencia/turma/relatorio", {
      turma_id: turmaId,
      alunos_presentes: alunosPresentes,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao fechar treino:", error);
    throw error;
  }
}
