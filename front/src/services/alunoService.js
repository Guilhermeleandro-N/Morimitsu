import api from "../api/axios"
import { buscarUser } from "./userService"

export async function criarAlunoExistente(usuarioId, faixa, grau_faixa, frequencia_atual, data_nascimento) {
  try {
    const response = await api.post("aluno", { usuarioId, faixa, grau_faixa, frequencia_atual, data_nascimento });
    return response;
  } catch (error) {
    console.error("Erro ao criar aluno para usuário existente:", error);
    throw error;
  }
}

export async function listarAlunosCompleto() {
  const usersResponse = await api.get("user");
  const alunosResponse = await api.get("aluno");
  const users = usersResponse.data?.data ?? usersResponse.data;
  const alunos = alunosResponse.data?.data ?? alunosResponse.data;
  return alunos.map(aluno => ({ ...aluno, usuario: users.find(user => user.id === aluno.usuarioId) }));
}

export async function BuscarAlunoCompletoPorUserId(userId) {
  const userData = await buscarUser(userId);
  const alunoData = await BuscaAlunoPorUserId(userId);
  return { ...userData, ...alunoData };
}

export async function BuscaAlunoPorUserId(userId) {
  const response = await api.get(`aluno/usuario/${userId}`);
  return response.data;
}

export async function atualizarAluno(usuarioId, nome, email, senha, telefone, data_nascimento, faixa, grau, frequencia_atual) {
  try {
    await api.patch(`user/${usuarioId}`, { nome, email, telefone, ...(senha ? { senha } : {}) });
    const aluno = await BuscaAlunoPorUserId(usuarioId);
    const response = await api.patch(`aluno/${aluno.id}`, { faixa, grau_faixa: grau, frequencia_atual, data_nascimento });
    return response;
  } catch (error) {
    console.log("Erro ao atualizar aluno");
    console.log(error);
    return error;
  }
}

export const graduarAluno = async (alunoId, faixa, grau_faixa) => {
  try {
    const response = await api.patch(`/aluno/${alunoId}/graduar`, { faixa, grau_faixa });
    return response.data;
  } catch (error) {
    console.error("Erro ao graduar aluno:", error);
    throw error;
  }
};
