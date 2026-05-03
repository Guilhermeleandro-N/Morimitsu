import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AlunoRepository } from './aluno.repository.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

@Injectable()
export class AlunoService {
  constructor(private readonly repository: AlunoRepository) {}

  async criar(dto: CreateAlunoDto): Promise<AlunoEntity> {
    const usuarioExiste = await this.repository.usuarioExiste(dto.usuarioId);

    if (!usuarioExiste) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const alunoJaExiste = await this.repository.alunoJaExiste(dto.usuarioId);

    if (alunoJaExiste) {
      throw new ConflictException('Usuário já é aluno');
    }

    return this.repository.criar(dto);
  }
}
