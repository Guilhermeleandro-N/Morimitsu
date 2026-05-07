import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AlunoEntity } from '../aluno/entities/aluno.entity.js';
import { ProfessorEntity } from '../professor/entities/professor.entity.js';
import { AddAlunoTurmaDto } from './dtos/add-aluno-turma.dto.js';
import { AddProfessorTurmaDto } from './dtos/add-professor-turma.dto.js';
import { CreateTurmaDto } from './dtos/create-turma.dto.js';
import { UpdateTurmaDto } from './dtos/update-turma.dto.js';
import { TurmaEntity } from './entities/turma.entity.js';
import { TurmaRepository } from './turma.repository.js';

@Injectable()
export class TurmaService {
  constructor(private readonly repository: TurmaRepository) {}

  async criar(dto: CreateTurmaDto): Promise<TurmaEntity> {
    return this.repository.criar(dto);
  }

  async listar(): Promise<TurmaEntity[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: string): Promise<TurmaEntity> {
    const turma = await this.repository.buscarPorId(id);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return turma;
  }

  async atualizar(id: string, dto: UpdateTurmaDto): Promise<TurmaEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Turma não encontrada');
    const atualizada = await this.repository.atualizar(id, dto);
    if (!atualizada) throw new NotFoundException('Turma não encontrada');
    return atualizada;
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Turma não encontrada');
    await this.repository.deletar(id);
  }

  async adicionarAluno(turmaId: string, dto: AddAlunoTurmaDto): Promise<void> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    await this.repository.adicionarAluno(turmaId, dto);
  }

  async adicionarProfessor(turmaId: string, dto: AddProfessorTurmaDto): Promise<void> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    await this.repository.adicionarProfessor(turmaId, dto);
  }

  async listarAlunos(turmaId: string): Promise<AlunoEntity[]> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return this.repository.listarAlunosDaTurma(turmaId);
  }

  async listarProfessores(turmaId: string): Promise<ProfessorEntity[]> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return this.repository.listarProfessoresDaTurma(turmaId);
  }
}
