import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AlunoEntity } from '../aluno/entities/aluno.entity.js';
import { ProfessorEntity } from '../professor/entities/professor.entity.js';
import { AddAlunoTurmaDto } from './dtos/add-aluno-turma.dto.js';
import { AddProfessorTurmaDto } from './dtos/add-professor-turma.dto.js';
import { CreateTurmaDto } from './dtos/create-turma.dto.js';
import { UpdateTurmaDto } from './dtos/update-turma.dto.js';
import { TurmaEntity } from './entities/turma.entity.js';

@Injectable()
export class TurmaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateTurmaDto): Promise<TurmaEntity> {
    const turma = await this.prisma.turma.create({ data: dto });
    return this.toEntity(turma);
  }

  async listar(): Promise<TurmaEntity[]> {
    const turmas = await this.prisma.turma.findMany();
    return turmas.map((t) => this.toEntity(t));
  }

  async buscarPorId(id: string): Promise<TurmaEntity | null> {
    const turma = await this.prisma.turma.findUnique({ where: { id } });
    if (!turma) return null;
    return this.toEntity(turma);
  }

  async atualizar(id: string, dto: UpdateTurmaDto): Promise<TurmaEntity | null> {
    const turma = await this.prisma.turma.update({ where: { id }, data: dto });
    return this.toEntity(turma);
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.turma.delete({ where: { id } });
  }

  async adicionarAluno(turmaId: string, dto: AddAlunoTurmaDto): Promise<void> {
    await this.prisma.alunoTurma.upsert({
      where: { aluno_id_turma_id: { aluno_id: dto.aluno_id, turma_id: turmaId } },
      update: {},
      create: { aluno_id: dto.aluno_id, turma_id: turmaId },
    });
  }

  async adicionarProfessor(turmaId: string, dto: AddProfessorTurmaDto): Promise<void> {
    await this.prisma.professorTurma.upsert({
      where: { professor_id_turma_id: { professor_id: dto.professor_id, turma_id: turmaId } },
      update: {},
      create: { professor_id: dto.professor_id, turma_id: turmaId },
    });
  }

  async listarAlunosDaTurma(turmaId: string): Promise<AlunoEntity[]> {
    const vinculos = await this.prisma.alunoTurma.findMany({
      where: { turma_id: turmaId },
      include: { aluno: true },
    });
    return vinculos.map((v) => {
      const entity = new AlunoEntity();
      entity.id = v.aluno.id;
      entity.frequencia_atual = v.aluno.frequencia_atual;
      entity.grau_faixa = v.aluno.grau_faixa;
      entity.faixa = v.aluno.faixa;
      entity.usuarioId = v.aluno.usuarioId;
      return entity;
    });
  }

  async listarProfessoresDaTurma(turmaId: string): Promise<ProfessorEntity[]> {
    const vinculos = await this.prisma.professorTurma.findMany({
      where: { turma_id: turmaId },
      include: { professor: true },
    });
    return vinculos.map((v) => {
      const entity = new ProfessorEntity();
      entity.id = v.professor.id;
      entity.faixa = v.professor.faixa;
      entity.grau = v.professor.grau;
      entity.usuarioId = v.professor.usuarioId;
      return entity;
    });
  }

  async professorExisteNaTurma(professorId: string, turmaId: string): Promise<boolean> {
    const vinculo = await this.prisma.professorTurma.findUnique({
      where: { professor_id_turma_id: { professor_id: professorId, turma_id: turmaId } },
    });
    return !!vinculo;
  }

  async alunoExisteNaTurma(alunoId: string, turmaId: string): Promise<boolean> {
    const vinculo = await this.prisma.alunoTurma.findUnique({
      where: { aluno_id_turma_id: { aluno_id: alunoId, turma_id: turmaId } },
    });
    return !!vinculo;
  }

  private toEntity(turma: {
    id: string; nome: string; horario_inicio: Date; horario_fim: Date; data_especifica: Date | null;
    segunda: boolean; terca: boolean; quarta: boolean; quinta: boolean; sexta: boolean; sabado: boolean; domingo: boolean;
  }): TurmaEntity {
    const entity = new TurmaEntity();
    entity.id = turma.id;
    entity.nome = turma.nome;
    entity.horario_inicio = turma.horario_inicio;
    entity.horario_fim = turma.horario_fim;
    entity.data_especifica = turma.data_especifica;
    entity.segunda = turma.segunda;
    entity.terca = turma.terca;
    entity.quarta = turma.quarta;
    entity.quinta = turma.quinta;
    entity.sexta = turma.sexta;
    entity.sabado = turma.sabado;
    entity.domingo = turma.domingo;
    return entity;
  }
}
