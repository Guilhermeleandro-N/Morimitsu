import { Injectable } from '@nestjs/common';
import { NotificacaoEntity } from './entities/notificacao.entity';
import { NotificacaoRepository } from './notificacao.repository';

@Injectable()
export class NotificacaoService {
  constructor(private readonly repository: NotificacaoRepository) {}

  async listarPorProfessor(
    professorUsuarioId: string,
  ): Promise<NotificacaoEntity[]> {
    return this.repository.listarPorProfessor(professorUsuarioId);
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
