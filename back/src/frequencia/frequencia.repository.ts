import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto.js';
import { FrequenciaEntity } from './entities/frequencia.entity.js';

@Injectable()
export class FrequenciaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(dto: CreateFrequenciaDto): Promise<FrequenciaEntity> {
    const frequencia = await this.prisma.frequenciaAluno.create({ data: dto });
    return this.toEntity(frequencia);
  }

  async listarPorAluno(alunoId: string): Promise<FrequenciaEntity[]> {
    const frequencias = await this.prisma.frequenciaAluno.findMany({
      where: { aluno_id: alunoId },
      orderBy: { data: 'desc' },
    });
    return frequencias.map((f) => this.toEntity(f));
  }

  async listarPorTurma(turmaId: string): Promise<FrequenciaEntity[]> {
    const frequencias = await this.prisma.frequenciaAluno.findMany({
      where: { turma_id: turmaId },
      orderBy: { data: 'desc' },
    });
    return frequencias.map((f) => this.toEntity(f));
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

  private toEntity(f: {
    id: string; aluno_id: string; professor_id: string; turma_id: string;
    data: Date; horario_inicio: Date; horario_fim: Date; status_presenca: string;
  }): FrequenciaEntity {
    const entity = new FrequenciaEntity();
    entity.id = f.id;
    entity.aluno_id = f.aluno_id;
    entity.professor_id = f.professor_id;
    entity.turma_id = f.turma_id;
    entity.data = f.data;
    entity.horario_inicio = f.horario_inicio;
    entity.horario_fim = f.horario_fim;
    entity.status_presenca = f.status_presenca;
    return entity;
  }
}
