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