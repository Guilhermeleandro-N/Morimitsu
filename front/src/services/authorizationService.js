import api from "../api/axios";

export async function listarPerfis() {
  try {
    const response = await api.get("authorization/perfis");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar perfis:", error);
    throw error;
  }
}

export async function listarPerfisDoUsuario(userId) {
  try {
    const response = await api.get(`authorization/user/${userId}/perfis`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar perfis do usuário:", error);
    throw error;
  }
}

export async function listarPermissoesDoPerfil(perfilId) {
  try {
    const response = await api.get(`authorization/perfis/${perfilId}/permissoes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar permissões:", error);
    throw error;
  }
}

export async function atribuirPerfil(userId, perfilId) {
  try {
    const response = await api.post(`authorization/user/${userId}/perfil`, { perfil_id: perfilId });
    return response.data;
  } catch (error) {
    console.error("Erro ao atribuir perfil:", error);
    throw error;
  }
}

export async function removerPerfil(userId, perfilId) {
  try {
    await api.delete(`authorization/user/${userId}/perfil/${perfilId}`);
  } catch (error) {
    console.error("Erro ao remover perfil:", error);
    throw error;
  }
}

export async function listarUsuarios() {
  try {
    const response = await api.get("user");
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
}
