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
import { AlunoTurmaEntity } from './entities/aluno-turma.entity';

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

  async listarMinhasTurmas(usuarioId: string): Promise<AlunoTurmaEntity[]> {
    return this.repository.listarTurmasPorAlunoUsuarioId(usuarioId);
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

  async graduar(
    id: string,
    dto?: { faixa?: string; grau_faixa?: number },
  ): Promise<AlunoEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Aluno não encontrado');

    if (dto?.faixa !== undefined || dto?.grau_faixa !== undefined) {
      // Manual override
      const updateDto = new UpdateAlunoDto();
      if (dto.faixa !== undefined) updateDto.faixa = dto.faixa;
      if (dto.grau_faixa !== undefined) updateDto.grau_faixa = dto.grau_faixa;
      const entity = await this.repository.atualizar(id, updateDto);
      if (!entity) throw new NotFoundException('Aluno não encontrado');
      return this.enriquecer(entity);
    }

    // Auto-calculate: cada 30 de frequencia_atual sobe 1 grau, 4 graus troca de faixa
    const grauAtual = existente.grau_faixa;
    const faixaAtual = existente.faixa;
    const totalGraus = Math.floor(existente.frequencia_atual / 30);

    const FAIXAS = [
      'BRANCA',
      'CINZA',
      'AMARELA',
      'LARANJA',
      'VERDE',
      'AZUL',
      'ROXA',
      'MARROM',
      'PRETA',
    ];

    let indiceFaixa = FAIXAS.indexOf(faixaAtual);
    if (indiceFaixa === -1) indiceFaixa = 0;

    let grausRestantes = totalGraus + grauAtual;

    while (grausRestantes >= 4 && indiceFaixa < FAIXAS.length - 1) {
      grausRestantes -= 4;
      indiceFaixa++;
    }

    const novaFaixa = FAIXAS[indiceFaixa];
    const novoGrau = grausRestantes;

    if (novaFaixa === faixaAtual && novoGrau === grauAtual) {
      throw new BadRequestException(
        'Aluno ainda não possui frequência suficiente para graduar',
      );
    }

    const updateDto = new UpdateAlunoDto();
    updateDto.faixa = novaFaixa;
    updateDto.grau_faixa = novoGrau;
    const entity = await this.repository.atualizar(id, updateDto);
    if (!entity) throw new NotFoundException('Aluno não encontrado');
    return this.enriquecer(entity);
  }

  private async enriquecer(entity: AlunoEntity): Promise<AlunoEntity> {
    entity.roles = ['aluno'];
    entity.permissoes = await this.authorizationService.getUserPermissions(
      entity.usuarioId,
    );
    return entity;
  }
}
