import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async criar(dto: CreateUserDto): Promise<UserEntity> {
    const existente = await this.repository.buscarPorEmail(dto.email);
    if (existente) throw new ConflictException('Email já cadastrado');
    return this.repository.criar(dto);
  }

  async listar(): Promise<UserEntity[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: string): Promise<UserEntity> {
    const usuario = await this.repository.buscarPorId(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  async atualizar(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Usuário não encontrado');

    if (dto.email && dto.email !== existente.email) {
      const emailEmUso = await this.repository.buscarPorEmail(dto.email);
      if (emailEmUso) throw new ConflictException('Email já cadastrado');
    }

    const atualizado = await this.repository.atualizar(id, dto);
    if (!atualizado) throw new NotFoundException('Usuário não encontrado');
    return atualizado;
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Usuário não encontrado');
    await this.repository.deletar(id);
  }
}
