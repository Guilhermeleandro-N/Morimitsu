import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AlunoRepository } from './aluno.repository.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { UpdateAlunoDto } from './dtos/update-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

@Injectable()
export class AlunoService {
  constructor(private readonly repository: AlunoRepository) {}

  async criar(dto: CreateAlunoDto): Promise<AlunoEntity> {
    const usuarioExiste = await this.repository.usuarioExiste(dto.usuarioId);
    if (!usuarioExiste) throw new BadRequestException('Usuário não encontrado');

    const alunoJaExiste = await this.repository.alunoJaExiste(dto.usuarioId);
    if (alunoJaExiste) throw new ConflictException('Usuário já é aluno');

    return this.repository.criar(dto);
  }

  async listar(): Promise<AlunoEntity[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: string): Promise<AlunoEntity> {
    const aluno = await this.repository.buscarPorId(id);
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<AlunoEntity> {
    const aluno = await this.repository.buscarPorUsuarioId(usuarioId);
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }

  async atualizar(id: string, dto: UpdateAlunoDto): Promise<AlunoEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Aluno não encontrado');
    const atualizado = await this.repository.atualizar(id, dto);
    if (!atualizado) throw new NotFoundException('Aluno não encontrado');
    return atualizado;
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Aluno não encontrado');
    await this.repository.deletar(id);
  }
}
