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
    return response.data;
    

    } catch (error){
        throw error;
        
    }
}


export async function buscarUser(id){
   try {
    const response = await api.get(`user/${id}`);
    return response.data;
   } catch(error){
    console.log(error);
    throw error;
   }
}

export async function atualizarStatusUsuario(id, status) {
  try {
    const response = await api.patch(`user/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    throw error;
  }
}


