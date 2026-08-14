import api from "../api/axios";

export async function listarNotificacoes(limite = 100) {
  try {
    const primeira = await api.get("notificacao", {
      params: { page: 1, limit: limite },
    });
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
          .get("notificacao", { params: { page: i + 2, limit: limite } })
          .then((r) => {
            const b = r.data;
            return Array.isArray(b) ? b : (b?.data ?? []);
          })
      )
    );

    return demais.reduce((acc, dados) => acc.concat(dados), lista);
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

export async function marcarTodasNotificacoesComoLidas() {
  try {
    const response = await api.patch("notificacao/marcar-todas-lidas");
    return response.data;
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    throw error;
  }
}
