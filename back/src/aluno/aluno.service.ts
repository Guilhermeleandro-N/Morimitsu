import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlunoRepository } from './aluno.repository';
import { AuthorizationService } from '../authorization/authorization.service';
import { CreateAlunoDto } from './dtos/create-aluno.dto';
import { UpdateAlunoDto } from './dtos/update-aluno.dto';
import { AlunoEntity } from './entities/aluno.entity';

@Injectable()
export class AlunoService {
  constructor(
    private readonly repository: AlunoRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async criar(dto: CreateAlunoDto): Promise<AlunoEntity> {
    const usuarioExiste = await this.repository.usuarioExiste(dto.usuarioId);
    if (!usuarioExiste) throw new BadRequestException('Usuário não encontrado');

    const alunoJaExiste = await this.repository.alunoJaExiste(dto.usuarioId);
    if (alunoJaExiste) throw new ConflictException('Usuário já é aluno');

    const entity = await this.repository.criar(dto);
    return this.enriquecer(entity);
  }

  async listar(): Promise<AlunoEntity[]> {
    const entities = await this.repository.listar();
    return Promise.all(entities.map((e) => this.enriquecer(e)));
  }

  async listarDaTurmaDoProfessor(
    professorUsuarioId: string,
  ): Promise<AlunoEntity[]> {
    const entities = await this.repository.listarPorProfessorUsuarioId(professorUsuarioId);
    return Promise.all(entities.map((e) => this.enriquecer(e)));
  }

  async buscarPorId(id: string): Promise<AlunoEntity> {
    const entity = await this.repository.buscarPorId(id);
    if (!entity) throw new NotFoundException('Aluno não encontrado');
    return this.enriquecer(entity);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<AlunoEntity> {
    const entity = await this.repository.buscarPorUsuarioId(usuarioId);
    if (!entity) throw new NotFoundException('Aluno não encontrado');
    return this.enriquecer(entity);
  }

  async buscarMeuPerfil(usuarioId: string): Promise<AlunoEntity> {
    const perfil = await this.repository.buscarPerfilCompleto(usuarioId);
    if (!perfil) throw new NotFoundException('Perfil de aluno não encontrado');

    const totalPresencas = perfil.historico.filter(
      (f) => f.status_presenca === 'PRESENTE',
    ).length;

    const entity = new AlunoEntity();
    entity.id = perfil.id;
    entity.usuarioId = perfil.usuarioId;
    entity.nome = perfil.nome;
    entity.email = perfil.email;
    entity.telefone = perfil.telefone;
    entity.data_nascimento = perfil.data_nascimento;
    entity.faixa = perfil.faixa;
    entity.grau_faixa = perfil.grau_faixa;
    entity.frequencia_atual = perfil.frequencia_atual;
    entity.total_presencas = totalPresencas;
    entity.historico_frequencias = perfil.historico;
    return this.enriquecer(entity);
  }

  async atualizar(id: string, dto: UpdateAlunoDto): Promise<AlunoEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Aluno não encontrado');
    const entity = await this.repository.atualizar(id, dto);
    if (!entity) throw new NotFoundException('Aluno não encontrado');
    return this.enriquecer(entity);
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Aluno não encontrado');
    await this.repository.deletar(id);
  }

  private async enriquecer(entity: AlunoEntity): Promise<AlunoEntity> {
    entity.roles = ['aluno'];
    entity.permissoes = await this.authorizationService.getUserPermissions(
      entity.usuarioId,
    );
    return entity;
  }
}
