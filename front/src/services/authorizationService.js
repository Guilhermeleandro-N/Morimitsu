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

export async function listarPermissoes() {
  try {
    const response = await api.get("authorization/permissoes");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar permissões:", error);
    throw error;
  }
}

export async function listarPermissoesDoUsuario(userId) {
  try {
    const response = await api.get(`authorization/user/${userId}/permissoes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar permissões do usuário:", error);
    throw error;
  }
}

export async function definirPermissaoDoUsuario(userId, permissionId, ativa) {
  try {
    const response = await api.post(`authorization/user/${userId}/permissao`, {
      permission_id: permissionId,
      ativa,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao definir permissão do usuário:", error);
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

export async function listarUsuarios(limite = 100) {
  try {
    const primeira = await api.get("user", { params: { page: 1, limit: limite } });
    const body = primeira.data;
    const lista = Array.isArray(body) ? body : (body?.data ?? []);
    const totalPages = Array.isArray(body)
      ? 1
      : (body?.meta?.totalPages ??
        Math.ceil((body?.meta?.total ?? lista.length) / limite));

    if (totalPages <= 1) return lista;

    const demais = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        api
          .get("user", { params: { page: i + 2, limit: limite } })
          .then((r) => {
            const b = r.data;
            return Array.isArray(b) ? b : (b?.data ?? []);
          })
      )
    );

    return demais.reduce((acc, dados) => acc.concat(dados), lista);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
}
