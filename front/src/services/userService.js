import api from "../api/axios"

export async function criarUser(nome, email, senha, telefone){
    try {
        const response = await api.post("user", {
        nome,
        senha,
        email,
        telefone
    });
    console.log("Criar User bem sucedido!")
    return response;
    

    } catch (error){
        
        return error;
        
    }
}


export async function buscarUser(id){
   try {
    const response = await api.get(`user/${id}`
    );
    
    return response.data;
    
   }catch(error){
    return error
    console.log(error)
   }
}


