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
}
