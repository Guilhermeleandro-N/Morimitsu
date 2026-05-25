import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificacaoEntity } from './entities/notificacao.entity.js';

@Injectable()
export class NotificacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarPorProfessor(
    professorUsuarioId: string,
  ): Promise<NotificacaoEntity[]> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId: professorUsuarioId },
        select: { id: true },
      });
      if (!professor) return [];

      const notificacoes = await this.prisma.notificacao.findMany({
        where: { professor_id: professor.id },
        orderBy: { created_at: 'desc' },
      });
      return notificacoes.map((n) => this.toEntity(n));
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar notificações no banco de dados',
      );
    }
  }

  async marcarComoLida(
    id: string,
    professorUsuarioId: string,
  ): Promise<NotificacaoEntity> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId: professorUsuarioId },
        select: { id: true },
      });

      const notificacao = await this.prisma.notificacao.findUnique({
        where: { id },
      });
      if (!notificacao)
        throw new NotFoundException('Notificação não encontrada');
      if (professor && notificacao.professor_id !== professor.id) {
        throw new NotFoundException('Notificação não encontrada');
      }

      const atualizada = await this.prisma.notificacao.update({
        where: { id },
        data: { lida: true },
      });
      return this.toEntity(atualizada);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Notificação não encontrada');
      throw new InternalServerErrorException(
        'Erro ao atualizar notificação no banco de dados',
      );
    }
  }

  async contarNaoLidas(professorUsuarioId: string): Promise<number> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId: professorUsuarioId },
        select: { id: true },
      });
      if (!professor) return 0;

      return this.prisma.notificacao.count({
        where: { professor_id: professor.id, lida: false },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao contar notificações no banco de dados',
      );
    }
  }

  private toEntity(n: {
    id: string;
    professor_id: string;
    aluno_id: string;
    mensagem: string;
    lida: boolean;
    created_at: Date;
  }): NotificacaoEntity {
    const entity = new NotificacaoEntity();
    entity.id = n.id;
    entity.professor_id = n.professor_id;
    entity.aluno_id = n.aluno_id;
    entity.mensagem = n.mensagem;
    entity.lida = n.lida;
    entity.created_at = n.created_at;
    return entity;
  }
}
