import api from "../api/axios";


export async function criarProfessor(
  usuarioId,
  faixa,
  grau
) {
  try {

    const response = await api.post(
      "professor",
      {
        usuarioId,
        faixa,
        grau,
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Erro ao criar professor:",
      error
    );

    throw error;

  }
}


export async function listarProfessores() {
  try {

    const response = await api.get("professor");

    return response.data;

  } catch (error) {

    console.error(
      "Erro ao listar professores:",
      error
    );

    throw error;

  }
}

export async function buscarProfessorPorUsuarioId(
  usuarioId
) {
  try {

    const response = await api.get(
      `professor/usuario/${usuarioId}`
    );

    return response.data;

  } catch (error) {

    console.error(
      "Erro ao buscar professor pelo usuário:",
      error
    );

    throw error;

  }
}



