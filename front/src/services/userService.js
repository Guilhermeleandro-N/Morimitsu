import api from "../api/axios"

export async function criarUser(nome, email, senha, telefone){
    try {
        const response = await api.post("user", {
        nome,
        senha,
        email,
        telefone
    });
    return response;
    console.log("Criar User bem sucedido!")

    } catch (error){
        
        return error;
        
    }
}

/*const usuarioCriado =  await criarUser("Guilherme Leandro", "Guilherme@email.com", "Senha@123", "(11) 99999-9998")

console.log(usuarioCriado);*/

