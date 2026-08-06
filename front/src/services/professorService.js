import api from "../api/axios";
import {buscarUser} from "./userService.js";

export async function criarProfessor(
  usuarioId,
  faixa,
  grau,
  data_nascimento
) {
  try {

    const response = await api.post(
      "professor",
      {
        usuarioId,
        faixa,
        grau,
        ...(data_nascimento ? { data_nascimento } : {}),
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

    return response.data?.data ?? response.data;

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

export async function buscarDashboardProfessor() {
  try {
    const response = await api.get("professor/dashboard");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dashboard do professor:", error);
    throw error;
  }
}

export async function atualizarProfessor(id, dados) {
  try {
    const response = await api.patch(`professor/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar professor:", error);
    throw error;
  }
}

