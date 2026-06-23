import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthorizationService } from '../authorization/authorization.service';
import { CreateProfessorDto } from './dtos/create-professor.dto';
import { PainelTurmaItem } from './dtos/painel-professor.dto';
import { UpdateProfessorDto } from './dtos/update-professor.dto';
import { ProfessorEntity } from './entities/professor.entity';
import { ProfessorRepository } from './professor.repository';

@Injectable()
export class ProfessorService {
  constructor(
    private readonly repository: ProfessorRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    const usuarioExiste = await this.repository.usuarioExiste(dto.usuarioId);
    if (!usuarioExiste) throw new BadRequestException('Usuário não encontrado');

    const professorJaExiste = await this.repository.professorJaExiste(
      dto.usuarioId,
    );
    if (professorJaExiste)
      throw new ConflictException('Usuário já é professor');

    const entity = await this.repository.criar(dto);
    return this.enriquecer(entity);
  }

  async listar(): Promise<ProfessorEntity[]> {
    const entities = await this.repository.listar();
    return Promise.all(entities.map((e) => this.enriquecer(e)));
  }

  async buscarPorId(id: string): Promise<ProfessorEntity> {
    const entity = await this.repository.buscarPorId(id);
    if (!entity) throw new NotFoundException('Professor não encontrado');
    return this.enriquecer(entity);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<ProfessorEntity> {
    const entity = await this.repository.buscarPorUsuarioId(usuarioId);
    if (!entity) throw new NotFoundException('Professor não encontrado');
    return this.enriquecer(entity);
  }

  async atualizar(
    id: string,
    dto: UpdateProfessorDto,
  ): Promise<ProfessorEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Professor não encontrado');
    const entity = await this.repository.atualizar(id, dto);
    if (!entity) throw new NotFoundException('Professor não encontrado');
    return this.enriquecer(entity);
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Professor não encontrado');
    await this.repository.deletar(id);
  }

  async painel(usuarioId: string): Promise<PainelTurmaItem[]> {
    const professor = await this.repository.buscarPorUsuarioId(usuarioId);
    if (!professor) throw new NotFoundException('Professor não encontrado');
    return this.repository.buscarPainel(professor.id);
  }

  private async enriquecer(entity: ProfessorEntity): Promise<ProfessorEntity> {
    entity.roles = ['professor'];
    entity.permissoes = await this.authorizationService.getUserPermissions(
      entity.usuarioId,
    );
    return entity;
  }
}
