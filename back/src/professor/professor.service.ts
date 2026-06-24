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
    // Resolve usuarioId: from alunoId or from dto directly
    let usuarioId: string;
    let faixa: string | undefined = dto.faixa;
    let grau: number | undefined = dto.grau;

    if (dto.alunoId) {
      const aluno = await this.repository.buscarAlunoPorId(dto.alunoId);
      if (!aluno) throw new BadRequestException('Aluno não encontrado');

      usuarioId = aluno.usuarioId;

      // Validate that if usuarioId was also provided, it matches the aluno's
      if (dto.usuarioId && dto.usuarioId !== aluno.usuarioId) {
        throw new BadRequestException(
          'usuarioId informado não corresponde ao aluno vinculado',
        );
      }

      // Auto-populate faixa and grau from aluno if not explicitly provided
      if (faixa === undefined) faixa = aluno.faixa;
      if (grau === undefined) grau = aluno.grau_faixa;
    } else {
      if (!dto.usuarioId)
        throw new BadRequestException(
          'usuarioId é obrigatório quando alunoId não é informado',
        );
      usuarioId = dto.usuarioId;
    }

    const usuarioExiste = await this.repository.usuarioExiste(usuarioId);
    if (!usuarioExiste) throw new BadRequestException('Usuário não encontrado');

    const professorJaExiste =
      await this.repository.professorJaExiste(usuarioId);
    if (professorJaExiste)
      throw new ConflictException('Usuário já é professor');

    const entity = await this.repository.criar({ usuarioId, faixa, grau });
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

    // Sincroniza faixa e grau com o perfil de aluno vinculado ao mesmo usuário
    if (dto.faixa !== undefined || dto.grau !== undefined) {
      const alunoVinculado = await this.repository.buscarAlunoPorUsuarioId(
        entity.usuarioId,
      );
      if (alunoVinculado) {
        const novaFaixa = dto.faixa ?? existente.faixa;
        const novoGrau = dto.grau ?? existente.grau;
        await this.repository.atualizarAlunoFaixaGrau(
          alunoVinculado.id,
          novaFaixa,
          novoGrau,
        );
      }
    }

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
