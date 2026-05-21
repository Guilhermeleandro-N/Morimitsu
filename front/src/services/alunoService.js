import api from "../api/axios"
import { criarUser } from "./userService"

export async function criarAluno(
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
        //}catch(error){
        //    return error
        //}
}

export async function listarAlunoCompleto(){
    const usersResponse = await api.get("user");
    const alunosResponse = await api.get("aluno");

    const users = usersResponse.data;
    const alunos = alunosResponse.data;
    console.log(users)
    console.log(alunos) 

    const resultado = alunos.map(aluno => {
        const user = users.find(user => user.id === aluno.usuarioId);

        return {
            ...aluno,
            usuario: user
        };
    });
    console.log(resultado)
    return resultado

}

