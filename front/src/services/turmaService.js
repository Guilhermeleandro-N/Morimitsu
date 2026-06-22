import api from "../api/axios";

export async function criarTurma(
    nome,
    horario_inicio,
    horario_fim,
    data_especifica,
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
            data_especifica: data_especifica,
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

        return response.data;

    } catch (error) {

        console.log("Erro ao buscar turmas");
        console.log(error);

        return [];

    }

}

/*export async function AtualizarTurma(id, nome, 
            horario_inicio, 
            horario_fim, 
            data_especifica, 
            segunda, 
            terca, 
            quarta, 
            quinta, 
            sexta, 
            sabado, 
            domingo){
    try{
        const response = await  api.patch(`turma/${id}`,{
            nome, 
            horario_inicio, 
            horario_fim, 
            data_especifica, 
            segunda, 
            terca, 
            quarta, 
            quinta, 
            sexta, 
            sabado, 
            domingo
        })
        console.log("Turma atualizada")
    }catch(error){
        console.log(error)
        return error;
    }
}*/

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
        return response.data;
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