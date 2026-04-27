import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dtos/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto.js';
import { AuthEntity } from './entities/auth.entity.js';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criarUsuario(dto: CreateUsuarioDto): Promise<AuthEntity> {
    const senhaHash = await argon2.hash(dto.senha);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        telefone: dto.telefone,
      },
      include: { aluno: true, professor: true },
    });

    return this.toAuthEntity(usuario);
  }

  async buscarPorId(id: string): Promise<AuthEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { aluno: true, professor: true },
    });

    if (!usuario) {
      return null;
    }

    return this.toAuthEntity(usuario);
  }

  async listarUsuarios(): Promise<AuthEntity[]> {
    const usuarios = await this.prisma.usuario.findMany({
      include: { aluno: true, professor: true },
    });

    return usuarios.map((u) => this.toAuthEntity(u));
  }

  async atualizarUsuario(
    id: string,
    dto: UpdateUsuarioDto,
  ): Promise<AuthEntity | null> {
    const data: Record<string, unknown> = {};

    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.telefone !== undefined) data.telefone = dto.telefone;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.senha !== undefined) {
      data.senha = await argon2.hash(dto.senha);
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data,
      include: { aluno: true, professor: true },
    });

    return this.toAuthEntity(usuario);
  }

  async deletarUsuario(id: string): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
  }

  async buscarPorEmail(email: string): Promise<AuthEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: { aluno: true, professor: true },
    });

    if (!usuario) {
      return null;
    }

    return this.toAuthEntity(usuario);
  }

  async login(email: string, senha: string): Promise<AuthEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: { aluno: true, professor: true },
    });

    if (!usuario) {
      return null;
    }

    const senhaValida = await argon2.verify(usuario.senha, senha);

    if (!senhaValida) {
      return null;
    }

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
  }): AuthEntity {
    const roles: string[] = [];

    if (usuario.aluno) {
      roles.push('aluno');
    }

    if (usuario.professor) {
      roles.push('professor');
    }

    if (roles.length === 0) {
      roles.push('admin');
    }

    const auth = new AuthEntity();
    auth.id = usuario.id;
    auth.nome = usuario.nome;
    auth.email = usuario.email;
    auth.senhaHash = usuario.senha;
    auth.telefone = usuario.telefone;
    auth.status = usuario.status;
    auth.roles = roles;

    return auth;
  }
}
