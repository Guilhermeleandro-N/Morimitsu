import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorEmail(email: string): Promise<AuthEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        aluno: true,
        professor: true,
        userPerfis: {
          include: {
            perfil: {
              include: {
                perfilPermissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!usuario) return null;
    return this.toAuthEntity(usuario);
  }

  async buscarPorId(id: string): Promise<AuthEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        aluno: true,
        professor: true,
        userPerfis: {
          include: {
            perfil: {
              include: {
                perfilPermissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!usuario) return null;
    return this.toAuthEntity(usuario);
  }

  async login(email: string, senha: string): Promise<AuthEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        aluno: true,
        professor: true,
        userPerfis: {
          include: {
            perfil: {
              include: {
                perfilPermissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!usuario) return null;

    const senhaValida = await argon2.verify(usuario.senha, senha);
    if (!senhaValida) return null;

    return this.toAuthEntity(usuario);
  }

  private toAuthEntity(usuario: {
    id: string;
    nome: string;
    email: string;
    senha: string;
    telefone: string | null;
    status: string;
    aluno: { id: string } | null;
    professor: { id: string } | null;
    userPerfis: {
      perfil: {
        perfilPermissions: { permission: { codigo: string } }[];
      };
    }[];
  }): AuthEntity {
    const roles: string[] = [];

    if (usuario.aluno) roles.push('aluno');
    if (usuario.professor) roles.push('professor');
    if (usuario.email === 'admin@morimitsu.com') roles.push('admin');
    if (roles.length === 0) roles.push('user');

    const permissoes = new Set<string>();
    for (const up of usuario.userPerfis) {
      for (const pp of up.perfil.perfilPermissions) {
        permissoes.add(pp.permission.codigo);
      }
    }

    const auth = new AuthEntity();
    auth.id = usuario.id;
    auth.nome = usuario.nome;
    auth.email = usuario.email;
    auth.senhaHash = usuario.senha;
    auth.telefone = usuario.telefone;
    auth.status = usuario.status;
    auth.roles = roles;
    auth.permissoes = Array.from(permissoes);

    return auth;
  }
}
