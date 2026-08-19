import { Injectable } from '@nestjs/common';
import { NotificacaoEntity } from './entities/notificacao.entity';
import { NotificacaoRepository } from './notificacao.repository';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class NotificacaoService {
  constructor(private readonly repository: NotificacaoRepository) {}

  async listarParaUsuario(
    usuarioId: string,
    roles: string[],
    skip: number,
    take: number,
  ): Promise<PaginatedResult<NotificacaoEntity>> {
    const { data, total } = await this.repository.listarParaUsuario(
      usuarioId,
      roles,
      skip,
      take,
    );
    return new PaginatedResult(data, total, Math.floor(skip / take) + 1, take);
  }

  async marcarComoLida(
    id: string,
    usuarioId: string,
    roles: string[],
  ): Promise<NotificacaoEntity> {
    return this.repository.marcarComoLida(id, usuarioId, roles);
  }

  async contarNaoLidas(
    usuarioId: string,
    roles: string[],
  ): Promise<{ count: number }> {
    const count = await this.repository.contarNaoLidas(usuarioId, roles);
    return { count };
  }

  async marcarTodasComoLidas(
    usuarioId: string,
    roles: string[],
  ): Promise<{ atualizadas: number }> {
    const atualizadas = await this.repository.marcarTodasComoLidas(
      usuarioId,
      roles,
    );
    return { atualizadas };
  }
}
