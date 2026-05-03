import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateProfessorDto } from './dtos/create-professor.dto.js';
import { ProfessorEntity } from './entities/professor.entity.js';
import { ProfessorRepository } from './professor.repository.js';

@Injectable()
export class ProfessorService {
  constructor(private readonly repository: ProfessorRepository) {}

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    const usuarioExiste = await this.repository.usuarioExiste(dto.usuarioId);

    if (!usuarioExiste) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const professorJaExiste = await this.repository.professorJaExiste(
      dto.usuarioId,
    );

    if (professorJaExiste) {
      throw new ConflictException('Usuário já é professor');
    }

    return this.repository.criar(dto);
  }
}
