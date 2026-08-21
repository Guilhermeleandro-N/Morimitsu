import api from "../api/axios";
import {buscarUser} from "./userService.js";

export async function criarProfessor(
  usuarioId,
  faixa,
  grau,
  frequencia,
  data_nascimento
) {
  try {

    const response = await api.post(
      "professor",
      {
        usuarioId,
        faixa,
        grau,
        ...(frequencia !== undefined ? { frequencia_atual: frequencia } : {}),
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

    let professor = null;
    try {
      const resp =
        await api.get(
          `professor/usuario/${usuario.id}`
        );
      professor = resp.data;
    } catch {
      professor = {
        usuarioId: usuario.id,
        faixa: "--",
        grau: 0,
      };
    }

    return {
      usuario,
      professor,
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

export async function deletarProfessor(id) {
  try {
    await api.delete(`professor/${id}`);
  } catch (error) {
    console.error("Erro ao deletar professor:", error);
    throw error;
  }
}

