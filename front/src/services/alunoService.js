import api from "../api/axios"
import { buscarUser } from "./userService"

export async function criarAlunoExistente(usuarioId, faixa, grau_faixa, frequencia_atual, data_nascimento) {
  try {
    if (data_nascimento) {
      await api.patch(`user/${usuarioId}`, { data_nascimento });
    }
    const response = await api.post("aluno", { usuarioId, faixa, grau_faixa, frequencia_atual });
    return response;
  } catch (error) {
    console.error("Erro ao criar aluno para usuário existente:", error);
    throw error;
  }
}

async function buscarTudo(fn, limite = 100) {
  const primeira = await fn(1, limite);
  const lista = Array.isArray(primeira) ? primeira : (primeira?.data ?? []);
  const total =
    primeira?.meta?.total ??
    (Array.isArray(primeira) ? lista.length : lista.length);
  const paginas = Math.ceil(total / limite);

  if (paginas <= 1) return lista;

  const demais = await Promise.all(
    Array.from({ length: paginas - 1 }, (_, i) => fn(i + 2, limite))
  );
  return demais.reduce((acc, res) => {
    const dados = Array.isArray(res) ? res : (res?.data ?? []);
    return acc.concat(dados);
  }, lista);
}

export async function listarAlunosCompleto() {
  const [users, alunos] = await Promise.all([
    buscarTudo((page, limit) => api.get("user", { params: { page, limit } }).then((r) => r.data)),
    buscarTudo((page, limit) => api.get("aluno", { params: { page, limit } }).then((r) => r.data)),
  ]);
  return alunos.map(aluno => ({ ...aluno, usuario: users.find(user => user.id === aluno.usuarioId) }));
}

export async function BuscarAlunoCompletoPorUserId(userId) {
  const userData = await buscarUser(userId);
  const alunoData = await BuscaAlunoPorUserId(userId);
  return { ...userData, ...alunoData };
}

export async function buscarMeuPerfilAluno() {
  const response = await api.get("aluno/meu-perfil");
  return response.data;
}

export async function BuscaAlunoPorUserId(userId) {
  const response = await api.get(`aluno/usuario/${userId}`);
  return response.data;
}

export async function atualizarAluno(usuarioId, nome, email, senha, telefone, data_nascimento, faixa, grau, frequencia_atual) {
  try {
    await api.patch(`user/${usuarioId}`, {
      nome,
      email,
      telefone,
      data_nascimento: data_nascimento || undefined,
      ...(senha ? { senha } : {}),
    });
    const aluno = await BuscaAlunoPorUserId(usuarioId);
    const response = await api.patch(`aluno/${aluno.id}`, {
      faixa,
      grau_faixa: grau,
      frequencia_atual,
    });
    return response;
  } catch (error) {
    console.log("Erro ao atualizar aluno");
    console.log(error);
    return error;
  }
}

export async function deletarAluno(alunoId) {
  try {
    await api.delete(`aluno/${alunoId}`);
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
    throw error;
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

export const graduarProximoNivel = async (alunoId, turmaId) => {
  try {
    const response = await api.patch(`/aluno/${alunoId}/graduar/proximo`, {
      ...(turmaId ? { turma_id: turmaId } : {}),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao graduar aluno:", error);
    throw error;
  }
};
