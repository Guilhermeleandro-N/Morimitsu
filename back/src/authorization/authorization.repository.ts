import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPermissions(usuarioId: string): Promise<string[]> {
    const userPerfis = await this.prisma.userPerfil.findMany({
      where: { usuario_id: usuarioId },
      include: {
        perfil: {
          include: {
            perfilPermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    const permissions = new Set<string>();

    for (const up of userPerfis) {
      for (const pp of up.perfil.perfilPermissions) {
        permissions.add(pp.permission.codigo);
      }
    }

    return Array.from(permissions);
  }

  async listarPerfis() {
    return this.prisma.perfil.findMany({
      include: {
        perfilPermissions: {
          include: { permission: true },
        },
      },
    });
  }

  async listarPermissoesDoPerfil(perfilId: string) {
    const perfil = await this.prisma.perfil.findUnique({
      where: { id: perfilId },
      include: {
        perfilPermissions: {
          include: { permission: true },
        },
      },
    });
    return perfil?.perfilPermissions.map((pp) => pp.permission) ?? [];
  }

  async listarPerfisDoUsuario(userId: string) {
    const userPerfis = await this.prisma.userPerfil.findMany({
      where: { usuario_id: userId },
      include: { perfil: true },
    });
    return userPerfis.map((up) => up.perfil);
  }

  async atribuirPerfil(userId: string, perfilId: string) {
    return this.prisma.userPerfil.upsert({
      where: {
        usuario_id_perfil_id: {
          usuario_id: userId,
          perfil_id: perfilId,
        },
      },
      update: {},
      create: { usuario_id: userId, perfil_id: perfilId },
    });
  }

  async removerPerfil(userId: string, perfilId: string) {
    return this.prisma.userPerfil.delete({
      where: {
        usuario_id_perfil_id: {
          usuario_id: userId,
          perfil_id: perfilId,
        },
      },
    });
  }
}
