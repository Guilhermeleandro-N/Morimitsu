import api from "../api/axios";
import {buscarUser} from "./userService.js";

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

export async function buscarProfessorEUsuario(
  usuarioId
) {
  try {

    const usuario =
      await buscarUser(usuarioId);

    const professor =
      await api.get(
        `professor/usuario/${usuario.id}`
      );

    return {
      usuario,
      professor: professor.data,
    };

  } catch (error) {

    console.error(
      "Erro ao buscar dados do professor:",
      error
    );

    throw error;

  }
}

