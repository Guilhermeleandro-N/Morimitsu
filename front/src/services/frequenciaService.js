import api from "../api/axios";

export async function registrarFrequencia(frequencia) {
  try {
    const response = await api.post(
      "/frequencia",
      frequencia
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao registrar frequência:",
      error
    );

    throw error;
  }
}

import { buscarProfessorPorUsuarioId } from "./professorService";

export async function registrarFrequenciaTurma(
  usuarioId,
  turmaId,
  alunosPresentes
) {

  try {

    const professor =
      await buscarProfessorPorUsuarioId(
        usuarioId
      );

    const agora = new Date();

    const inicio = new Date(
      agora.getTime() - 2 * 60 * 60 * 1000
    );

    const promessas =
      alunosPresentes.map((alunoId) =>
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

    console.error(
      "Erro ao registrar frequência da turma:",
      error
    );

    throw error;

  }

}