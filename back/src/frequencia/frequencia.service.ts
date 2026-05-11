import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto.js';
import { FrequenciaEntity } from './entities/frequencia.entity.js';
import { FrequenciaRepository } from './frequencia.repository.js';

@Injectable()
export class FrequenciaService {
  constructor(private readonly repository: FrequenciaRepository) {}

  async registrar(dto: CreateFrequenciaDto): Promise<FrequenciaEntity> {
    const professorNaTurma = await this.repository.professorExisteNaTurma(dto.professor_id, dto.turma_id);
    if (!professorNaTurma) {
      throw new ForbiddenException('Professor não está vinculado a esta turma');
    }

    const alunoNaTurma = await this.repository.alunoExisteNaTurma(dto.aluno_id, dto.turma_id);
    if (!alunoNaTurma) {
      throw new BadRequestException('Aluno não está vinculado a esta turma');
    }

    return this.repository.registrar(dto);
  }

  async listarPorAluno(alunoId: string): Promise<FrequenciaEntity[]> {
    return this.repository.listarPorAluno(alunoId);
  }

  async listarPorTurma(turmaId: string): Promise<FrequenciaEntity[]> {
    return this.repository.listarPorTurma(turmaId);
  }
}
