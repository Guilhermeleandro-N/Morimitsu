import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerfilRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarTodasPermissoes(): Promise<
    { id: string; codigo: string; descricao: string }[]
  > {
    try {
      return this.prisma.permission.findMany({
        select: { id: true, codigo: true, descricao: true },
        orderBy: { codigo: 'asc' },
      });
    } catch {
      throw new InternalServerErrorException('Erro ao buscar permissões');
    }
  }

  async buscarPerfis(): Promise<
    { id: string; nome: string; _count: { perfilPermissions: number } }[]
  > {
    try {
      return this.prisma.perfil.findMany({
        select: {
          id: true,
          nome: true,
          _count: { select: { perfilPermissions: true } },
        },
        orderBy: { nome: 'asc' },
      });
    } catch {
      throw new InternalServerErrorException('Erro ao buscar perfis');
    }
  }

  async buscarPerfilPorId(id: string): Promise<{
    id: string;
    nome: string;
    perfilPermissions: {
      permission: { id: string; codigo: string; descricao: string };
    }[];
  } | null> {
    try {
      return this.prisma.perfil.findUnique({
        where: { id },
        select: {
          id: true,
          nome: true,
          perfilPermissions: {
            select: {
              permission: {
                select: { id: true, codigo: true, descricao: true },
              },
            },
          },
        },
      });
    } catch {
      throw new InternalServerErrorException('Erro ao buscar perfil');
    }
  }

  async buscarPermissoesPorCodigo(
    codigos: string[],
  ): Promise<{ id: string; codigo: string }[]> {
    try {
      return this.prisma.permission.findMany({
        where: { codigo: { in: codigos } },
        select: { id: true, codigo: true },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar permissões por código',
      );
    }
  }

  async upsertPerfilPermission(
    perfilId: string,
    permissionId: string,
  ): Promise<void> {
    try {
      await this.prisma.perfilPermission.upsert({
        where: {
          perfil_id_permission_id: {
            perfil_id: perfilId,
            permission_id: permissionId,
          },
        },
        update: {},
        create: { perfil_id: perfilId, permission_id: permissionId },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao vincular permissão ao perfil',
      );
    }
  }

  async deletePerfilPermission(
    perfilId: string,
    permissionId: string,
  ): Promise<void> {
    try {
      await this.prisma.perfilPermission.delete({
        where: {
          perfil_id_permission_id: {
            perfil_id: perfilId,
            permission_id: permissionId,
          },
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao remover permissão do perfil',
      );
    }
  }

  async buscarPerfisDoUsuario(
    usuarioId: string,
  ): Promise<{ perfil_id: string; perfil: { nome: string } }[]> {
    try {
      return this.prisma.userPerfil.findMany({
        where: { usuario_id: usuarioId },
        select: {
          perfil_id: true,
          perfil: { select: { nome: true } },
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar perfis do usuário',
      );
    }
  }

  async upsertUserPerfil(usuarioId: string, perfilId: string): Promise<void> {
    try {
      await this.prisma.userPerfil.upsert({
        where: {
          usuario_id_perfil_id: {
            usuario_id: usuarioId,
            perfil_id: perfilId,
          },
        },
        update: {},
        create: { usuario_id: usuarioId, perfil_id: perfilId },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao atribuir perfil ao usuário',
      );
    }
  }

  async deleteUserPerfil(usuarioId: string, perfilId: string): Promise<void> {
    try {
      await this.prisma.userPerfil.delete({
        where: {
          usuario_id_perfil_id: {
            usuario_id: usuarioId,
            perfil_id: perfilId,
          },
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao remover perfil do usuário',
      );
    }
  }

  async buscarAlunoPorUsuarioId(usuarioId: string): Promise<{
    id: string;
    faixa: string;
    grau_faixa: number;
    frequencia_atual: number;
  } | null> {
    try {
      return this.prisma.aluno.findUnique({
        where: { usuarioId },
        select: {
          id: true,
          faixa: true,
          grau_faixa: true,
          frequencia_atual: true,
        },
      });
    } catch {
      throw new InternalServerErrorException('Erro ao buscar aluno');
    }
  }

  async usuarioTemProfessor(usuarioId: string): Promise<boolean> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      return !!professor;
    } catch {
      throw new InternalServerErrorException('Erro ao verificar professor');
    }
  }

  async criarProfessor(
    usuarioId: string,
    faixa: string,
    grau: number,
  ): Promise<void> {
    try {
      await this.prisma.professor.create({
        data: { faixa, grau, usuarioId },
      });
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        throw new ConflictException('Usuário já é professor');
      }
      throw new InternalServerErrorException('Erro ao criar professor');
    }
  }

  async deletarProfessor(usuarioId: string): Promise<void> {
    try {
      await this.prisma.professor.delete({ where: { usuarioId } });
    } catch {
      throw new InternalServerErrorException('Erro ao remover professor');
    }
  }
}
