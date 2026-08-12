import api from "../api/axios";

export async function criarTurma(
    nome,
    horario_inicio,
    horario_fim,
    segunda,
    terca,
    quarta,
    quinta,
    sexta,
    sabado,
    domingo
){
    try {

        const response = await api.post("turma", {
            nome: nome,
            horario_inicio: horario_inicio,
            horario_fim: horario_fim,
            segunda: segunda,
            terca: terca,
            quarta: quarta,
            quinta: quinta,
            sexta: sexta,
            sabado: sabado,
            domingo: domingo
        });

        console.log("Turma criada com sucesso");
        console.log(response);

        return response;

    } catch(error){

        console.log("Erro ao criar turma");
        console.log(error);

        return error.response;
    }
}



export async function listarTurmas() {

    try {

        const response = await api.get("turma");

        console.log("Turmas encontradas:");
        console.log(response.data);

        return response.data?.data ?? response.data;

    } catch (error) {

        console.log("Erro ao buscar turmas");
        console.log(error);

        return [];

    }

}



export async function AtualizarTurma(id, dados) {
    try {
        const response = await api.patch(`turma/${id}`, dados);

        console.log("Turma atualizada");
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export const listarAlunosDaTurma = async (id) => {
    try {
        const response = await api.get(`/turma/${id}/alunos`);
        return response.data?.data ?? response.data;
    } catch (error) {
        console.error("Erro ao listar alunos da turma:", error);
        throw error;
    }
};



export const adicionarAlunoNaTurma = async (id, aluno_id, frequente = "S") => {
    try {
        const response = await api.post(`/turma/${id}/aluno`, {
            aluno_id,
            frequente
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao adicionar aluno à turma:", error);
        throw error;
    }
};

export const removerAlunoDaTurma = async (turmaId, alunoId) => {
  try {
    await api.delete(`/turma/${turmaId}/aluno/${alunoId}`);
  } catch (error) {
    console.error("Erro ao remover aluno da turma:", error);
    throw error;
  }
};

export async function adicionarProfessorTurma(
  turmaId,
  professorId
) {
  try {
    const response = await api.post(
      `/turma/${turmaId}/professor`,
      {
        professor_id: professorId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao adicionar professor à turma:",
      error
    );

    throw error;
  }
}

export async function atualizarStatusTurma(id, status) {
  try {
    const response = await api.patch(`turma/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status da turma:", error);
    throw error;
  }
}

export async function listarTurmasArquivadas() {
  try {
    const response = await api.get("turma/arquivadas");
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Erro ao listar turmas arquivadas:", error);
    throw error;
  }
}

export async function arquivarTurma(id) {
  try {
    const response = await api.patch(`turma/${id}/arquivar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao arquivar turma:", error);
    throw error;
  }
}

export async function reativarTurma(id) {
  try {
    const response = await api.patch(`turma/${id}/reativar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao reativar turma:", error);
    throw error;
  }
}

export async function excluirTurma(id) {
  try {
    await api.delete(`turma/${id}`);
  } catch (error) {
    console.error("Erro ao excluir turma:", error);
    throw error;
  }
}

export async function atualizarStatusAlunoNaTurma(turmaId, alunoId, frequente) {
  try {
    const response = await api.patch(`/turma/${turmaId}/aluno/${alunoId}`, { frequente });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status do aluno na turma:", error);
    throw error;
  }
}

export async function listarProfessoresDaTurma(
  turmaId
) {

  try {

    const response = await api.get(
      `/turma/${turmaId}/professores`
    );

    return response.data?.data ?? response.data;

  } catch (error) {

    console.error(
      "Erro ao listar professores da turma:",
      error
    );

    throw error;

  }

}