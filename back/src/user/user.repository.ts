import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateUserDto): Promise<UserEntity> {
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
    return this.toEntity(usuario);
  }

  async buscarPorId(id: string): Promise<UserEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { aluno: true, professor: true },
    });
    if (!usuario) return null;
    return this.toEntity(usuario);
  }

  async buscarPorEmail(email: string): Promise<UserEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: { aluno: true, professor: true },
    });
    if (!usuario) return null;
    return this.toEntity(usuario);
  }

  async listar(): Promise<UserEntity[]> {
    const usuarios = await this.prisma.usuario.findMany({
      include: { aluno: true, professor: true },
    });
    return usuarios.map((u) => this.toEntity(u));
  }

  async atualizar(id: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    const data: Record<string, unknown> = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.telefone !== undefined) data.telefone = dto.telefone;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.senha !== undefined) data.senha = await argon2.hash(dto.senha);

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data,
      include: { aluno: true, professor: true },
    });
    return this.toEntity(usuario);
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.aluno.deleteMany({ where: { usuarioId: id } }),
      this.prisma.professor.deleteMany({ where: { usuarioId: id } }),
      this.prisma.usuario.delete({ where: { id } }),
    ]);
  }

  private toEntity(usuario: {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    status: string;
    aluno: { id: string } | null;
    professor: { id: string } | null;
  }): UserEntity {
    const roles: string[] = [];
    if (usuario.aluno) roles.push('aluno');
    if (usuario.professor) roles.push('professor');
    if (roles.length === 0) roles.push('user');

    const entity = new UserEntity();
    entity.id = usuario.id;
    entity.nome = usuario.nome;
    entity.email = usuario.email;
    entity.telefone = usuario.telefone;
    entity.status = usuario.status;
    entity.roles = roles;
    return entity;
  }
}
