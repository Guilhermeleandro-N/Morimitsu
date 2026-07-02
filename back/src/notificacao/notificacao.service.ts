import { Injectable } from '@nestjs/common';
import { NotificacaoEntity } from './entities/notificacao.entity';
import { NotificacaoRepository } from './notificacao.repository';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class NotificacaoService {
  constructor(private readonly repository: NotificacaoRepository) {}

  async listarPorProfessor(
    professorUsuarioId: string,
    skip: number,
    take: number,
  ): Promise<PaginatedResult<NotificacaoEntity>> {
    const { data, total } = await this.repository.listarPorProfessor(
      professorUsuarioId,
      skip,
      take,
    );
    return new PaginatedResult(data, total, Math.floor(skip / take) + 1, take);
  }

  async marcarComoLida(
    id: string,
    professorUsuarioId: string,
  ): Promise<NotificacaoEntity> {
    return this.repository.marcarComoLida(id, professorUsuarioId);
  }

  async contarNaoLidas(professorUsuarioId: string): Promise<{ count: number }> {
    const count = await this.repository.contarNaoLidas(professorUsuarioId);
    return { count };
  }
}
