import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificacaoEntity } from './entities/notificacao.entity';

@Injectable()
export class NotificacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarParaUsuario(
    usuarioId: string,
    roles: string[],
    skip: number,
    take: number,
  ): Promise<{ data: NotificacaoEntity[]; total: number }> {
    try {
      const where = await this.montarFiltro(usuarioId, roles);
      const [notificacoes, total] = await Promise.all([
        this.prisma.notificacao.findMany({
          where,
          skip,
          take,
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.notificacao.count({ where }),
      ]);
      return { data: notificacoes.map((n) => this.toEntity(n)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar notificações no banco de dados',
      );
    }
  }

  async marcarComoLida(
    id: string,
    usuarioId: string,
    roles: string[],
  ): Promise<NotificacaoEntity> {
    try {
      const notificacao = await this.prisma.notificacao.findUnique({
        where: { id },
      });
      if (!notificacao)
        throw new NotFoundException('Notificação não encontrada');

      const pertence = await this.pertenceAoUsuario(
        notificacao,
        usuarioId,
        roles,
      );
      if (!pertence) {
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

  async contarNaoLidas(
    usuarioId: string,
    roles: string[],
  ): Promise<number> {
    try {
      const where = await this.montarFiltro(usuarioId, roles);
      return this.prisma.notificacao.count({
        where: { ...where, lida: false },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao contar notificações no banco de dados',
      );
    }
  }

  // Filtra as notificações conforme o perfil do usuário logado.
  private async montarFiltro(
    usuarioId: string,
    roles: string[],
  ): Promise<Prisma.NotificacaoWhereInput> {
    const or: Prisma.NotificacaoWhereInput[] = [];

    if (roles.includes('admin')) return {};

    if (roles.includes('professor')) {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      if (professor) {
        or.push({ professor_id: professor.id });
      }
    }

    if (roles.includes('aluno')) {
      const aluno = await this.prisma.aluno.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      if (aluno) {
        or.push({ aluno_id: aluno.id });
      }
    }

    if (or.length === 0) return { id: 'sem-acesso' };

    return { OR: or };
  }

  private async pertenceAoUsuario(
    notificacao: { professor_id: string; aluno_id: string },
    usuarioId: string,
    roles: string[],
  ): Promise<boolean> {
    if (roles.includes('admin')) return true;

    if (roles.includes('professor')) {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      if (professor && professor.id === notificacao.professor_id) {
        return true;
      }
    }

    if (roles.includes('aluno')) {
      const aluno = await this.prisma.aluno.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      if (aluno && aluno.id === notificacao.aluno_id) {
        return true;
      }
    }

    return false;
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
