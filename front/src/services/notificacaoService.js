import api from "../api/axios";

export async function listarNotificacoes(page = 1, limit = 20) {
  try {
    const response = await api.get("notificacao", {
      params: { page, limit },
    });
    return response.data?.data ?? response.data ?? [];
  } catch (error) {
    console.error("Erro ao listar notificações:", error);
    throw error;
  }
}

export async function contarNotificacoesNaoLidas() {
  try {
    const response = await api.get("notificacao/nao-lidas/count");
    return response.data?.count ?? 0;
  } catch (error) {
    console.error("Erro ao contar notificações:", error);
    return 0;
  }
}

export async function marcarNotificacaoComoLida(id) {
  try {
    const response = await api.patch(`notificacao/${id}/lida`);
    return response.data;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw error;
  }
}
