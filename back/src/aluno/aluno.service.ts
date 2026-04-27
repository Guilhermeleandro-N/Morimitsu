import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';
import { AlunoRepository } from './aluno.repository.js';

@Injectable()
export class AlunoService {
  constructor(private readonly repository: AlunoRepository) {}

  async criar(dto: CreateAlunoDto): Promise<AlunoEntity> {
    return this.repository.criar(dto);
  }

  async buscarPorIdOuFalhar(id: string): Promise<AlunoEntity> {
    const aluno = await this.repository.buscarPorId(id);

    if (!aluno) {
      throw new NotFoundException(`Aluno com id ${id} não encontrado`);
    }

    return aluno;
  }
}
