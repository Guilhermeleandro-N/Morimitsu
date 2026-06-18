import api from "../api/axios"
import { criarUser, buscarUser } from "./userService"

export async function criarAluno(
    nome,
    email,
    senha,
    telefone,
    data_nascimento,
    faixa,
    grau,
    frequencia_atual 
) {
    try {
        const response = await api.post("user/aluno", {
            nome: nome,
            email: email,
            senha: senha,
            telefone: telefone,
            data_nascimento: data_nascimento,
            faixa: faixa,
            grau_faixa: grau,
            frequencia_atual: frequencia_atual
        });

        return response;

    } catch (error) {
        console.log("Erro ao criar aluno");
        console.log(error);

        return error;
    }
}

/*export async function criarAluno(
    nome,
    email,
    faixa,
    telefone,
    grau,
    senha ){
    try{
        const user = await criarUser(
        nome,
        email,
        senha,
        telefone);
    
        if (user.status === 201){
        //try{
            console.log("Foi 201")
            console.log(user.data.id)
            const response = await api.post("aluno", {
                usuarioId: user.data.id,
                faixa: faixa,
                grau_faixa: grau 
                });
            console.log("Reponse depois de 201")
            console.log(response)

            return response 
        }
    }catch(error){
        return error
    }       
}*/

export async function listarAlunosCompleto(){
    const usersResponse = await api.get("user");
    const alunosResponse = await api.get("aluno");

    const users = usersResponse.data;
    const alunos = alunosResponse.data;
    

    const resultado = alunos.map(aluno => {
        const user = users.find(user => user.id === aluno.usuarioId);

        return {
            ...aluno,
            usuario: user
        };
    });
    
    return resultado

}

export async function BuscarAlunoCompletoPorUserId(userId){
    try{
        const userData = await buscarUser(userId);
        
        const alunoData = await BuscaAlunoPorUserId(userId);
        
        const alunoCompleto = {
            ...userData,
            ...alunoData
        };

        return alunoCompleto;
    }catch(error){
        return error;
    }

}

export async function BuscaAlunoPorUserId(userId){
    try {
        const response = await api.get(`aluno/usuario/${userId}`);
    
    return response.data;
    
   }catch(error){
    return error
    console.log(error)
   }
}


export async function atualizarAluno(
    usuarioId,
    nome,
    email,
    senha,
    telefone,
    data_nascimento,
    faixa,
    grau,
    frequencia_atual
){
    try {

        const response = await api.patch(`user/aluno/${usuarioId}`, {
            nome: nome,
            email: email,
            senha: senha,
            telefone: telefone,
            data_nascimento: data_nascimento,
            faixa: faixa,
            grau_faixa: grau,
            frequencia_atual: frequencia_atual
        });

        return response;

    } catch(error){

        console.log("Erro ao atualizar aluno");
        console.log(error);

        return error;
    }
}

