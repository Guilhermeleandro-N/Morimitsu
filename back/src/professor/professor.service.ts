import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessorDto } from './dtos/create-professor.dto.js';
import { UpdateProfessorDto } from './dtos/update-professor.dto.js';
import { ProfessorEntity } from './entities/professor.entity.js';
import { ProfessorRepository } from './professor.repository.js';

@Injectable()
export class ProfessorService {
  constructor(private readonly repository: ProfessorRepository) {}

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    const usuarioExiste = await this.repository.usuarioExiste(dto.usuarioId);
    if (!usuarioExiste) throw new BadRequestException('Usuário não encontrado');

    const professorJaExiste = await this.repository.professorJaExiste(
      dto.usuarioId,
    );
    if (professorJaExiste)
      throw new ConflictException('Usuário já é professor');

    return this.repository.criar(dto);
  }

  async listar(): Promise<ProfessorEntity[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: string): Promise<ProfessorEntity> {
    const professor = await this.repository.buscarPorId(id);
    if (!professor) throw new NotFoundException('Professor não encontrado');
    return professor;
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<ProfessorEntity> {
    const professor = await this.repository.buscarPorUsuarioId(usuarioId);
    if (!professor) throw new NotFoundException('Professor não encontrado');
    return professor;
  }

  async atualizar(
    id: string,
    dto: UpdateProfessorDto,
  ): Promise<ProfessorEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Professor não encontrado');
    const atualizado = await this.repository.atualizar(id, dto);
    if (!atualizado) throw new NotFoundException('Professor não encontrado');
    return atualizado;
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Professor não encontrado');
    await this.repository.deletar(id);
  }
}
