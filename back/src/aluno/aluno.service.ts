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
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import {
  GRAUS_POR_FAIXA,
  FAIXAS_MAIORES,
  FAIXAS_CRIANCAS,
  IDADE_LIMITE_FAIXA,
  calcularIdade,
  faixaPermitidaParaIdade,
} from '../common/faixas.constants';

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

    const dataNascimento = await this.repository.buscarDataNascimentoUsuario(
      dto.usuarioId,
    );
    const faixa = dto.faixa ?? 'BRANCA';
    if (!faixaPermitidaParaIdade(faixa, dataNascimento)) {
      throw new BadRequestException(
        'Faixa não permitida para a idade do aluno',
      );
    }

    const entity = await this.repository.criar({ ...dto, faixa });
    return this.enriquecer(entity);
  }

  async listar(
    skip: number,
    take: number,
  ): Promise<PaginatedResult<AlunoEntity>> {
    const { data, total } = await this.repository.listar(skip, take);
    const enriquecidos = await Promise.all(data.map((e) => this.enriquecer(e)));
    return new PaginatedResult(
      enriquecidos,
      total,
      Math.floor(skip / take) + 1,
      take,
    );
  }

  async listarDaTurmaDoProfessor(
    professorUsuarioId: string,
    skip: number,
    take: number,
  ): Promise<PaginatedResult<AlunoEntity>> {
    const { data, total } = await this.repository.listarPorProfessorUsuarioId(
      professorUsuarioId,
      skip,
      take,
    );
    const enriquecidos = await Promise.all(data.map((e) => this.enriquecer(e)));
    return new PaginatedResult(
      enriquecidos,
      total,
      Math.floor(skip / take) + 1,
      take,
    );
  }

  async buscarPorId(id: string): Promise<AlunoEntity> {
    const entity = await this.repository.buscarPorId(id);
    if (!entity) throw new NotFoundException('Aluno não encontrado');
    return this.enriquecer(entity);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<AlunoEntity> {
    const entity = await this.repository.buscarPorUsuarioId(usuarioId);
    if (!entity) throw new NotFoundException('Aluno não encontrado');
    entity.total_presencas = await this.repository.contarPresencas(entity.id);
    return this.enriquecer(entity);
  }

  async buscarMeuPerfil(usuarioId: string): Promise<AlunoEntity> {
    const perfil = await this.repository.buscarPerfilCompleto(usuarioId);
    if (!perfil) throw new NotFoundException('Perfil de aluno não encontrado');

    const totalPresencas = await this.repository.contarPresencas(perfil.id);

    const entity = new AlunoEntity();
    entity.id = perfil.id;
    entity.usuarioId = perfil.usuarioId;
    entity.nome = perfil.nome;
    entity.email = perfil.email;
    entity.telefone = perfil.telefone;
    entity.status = perfil.status;
    entity.data_nascimento = perfil.data_nascimento;
    entity.faixa = perfil.faixa;
    entity.grau_faixa = perfil.grau_faixa;
    entity.frequencia_atual = totalPresencas;
    entity.total_presencas = totalPresencas;
    entity.historico_frequencias = perfil.historico;
    return this.enriquecer(entity);
  }

  async atualizar(id: string, dto: UpdateAlunoDto): Promise<AlunoEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Aluno não encontrado');

    if (dto.faixa !== undefined) {
      const dataNascimento = await this.repository.buscarDataNascimentoUsuario(
        existente.usuarioId,
      );
      if (!faixaPermitidaParaIdade(dto.faixa, dataNascimento)) {
        throw new BadRequestException(
          'Faixa não permitida para a idade do aluno',
        );
      }
    }

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

      if (updateDto.faixa !== undefined) {
        const dataNascimento =
          await this.repository.buscarDataNascimentoUsuario(
            existente.usuarioId,
          );
        if (!faixaPermitidaParaIdade(updateDto.faixa, dataNascimento)) {
          throw new BadRequestException(
            'Faixa não permitida para a idade do aluno',
          );
        }
      }

      const entity = await this.repository.atualizar(id, updateDto);
      if (!entity) throw new NotFoundException('Aluno não encontrado');
      return this.enriquecer(entity);
    }

    // Auto-calculate: cada 30 de frequencia_atual sobe 1 grau, 4 graus troca de faixa
    const dataNascimento = await this.repository.buscarDataNascimentoUsuario(
      existente.usuarioId,
    );
    const progressao =
      dataNascimento &&
      calcularIdade(dataNascimento) > IDADE_LIMITE_FAIXA
        ? FAIXAS_MAIORES
        : FAIXAS_CRIANCAS;

    const grauAtual = existente.grau_faixa;
    const faixaAtual = existente.faixa;
    const totalGraus = Math.floor(existente.frequencia_atual / 30);

    let indiceFaixa = progressao.indexOf(faixaAtual);
    if (indiceFaixa === -1) indiceFaixa = 0;

    let grausRestantes = totalGraus + grauAtual;

    while (grausRestantes >= 4 && indiceFaixa < progressao.length - 1) {
      grausRestantes -= 4;
      indiceFaixa++;
    }

    const novaFaixa = progressao[indiceFaixa];
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

  async graduarProximoNivel(
    id: string,
    turmaId?: string,
  ): Promise<AlunoEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Aluno não encontrado');

    const dataNascimento = await this.repository.buscarDataNascimentoUsuario(
      existente.usuarioId,
    );
    const progressao =
      dataNascimento &&
      calcularIdade(dataNascimento) > IDADE_LIMITE_FAIXA
        ? FAIXAS_MAIORES
        : FAIXAS_CRIANCAS;

    let novoGrau = existente.grau_faixa + 1;
    let novaFaixa = existente.faixa;

    if (novoGrau > GRAUS_POR_FAIXA) {
      const indiceAtual = progressao.indexOf(existente.faixa);
      const proximoIndice = indiceAtual + 1;
      if (proximoIndice < progressao.length) {
        novaFaixa = progressao[proximoIndice];
      }
      novoGrau = 0;
    }

    if (novaFaixa === existente.faixa && novoGrau === existente.grau_faixa) {
      throw new BadRequestException('Aluno já está no nível máximo');
    }

    const updateDto = new UpdateAlunoDto();
    updateDto.faixa = novaFaixa;
    updateDto.grau_faixa = novoGrau;
    const entity = await this.repository.atualizar(id, updateDto);
    if (!entity) throw new NotFoundException('Aluno não encontrado');

    if (turmaId) {
      await this.repository.zerarFrequenciaTurma(entity.id, turmaId);
    }

    await this.repository.atualizarGraduacaoProfessor(
      entity.usuarioId,
      novaFaixa,
      novoGrau,
    );

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
