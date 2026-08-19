import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthorizationService } from '../authorization/authorization.service';
import {
  DashboardProfessorResponseDto,
  AlunoGraduacaoProximaDto,
  AlunoAniversarioProximoDto,
} from './dtos/dashboard-professor.dto';
import { FREQUENCIAS_POR_GRAU } from '../common/faixas.constants';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateProfessorDto } from './dtos/create-professor.dto';
import { UpdateProfessorDto } from './dtos/update-professor.dto';
import { ProfessorEntity } from './entities/professor.entity';
import { ProfessorRepository } from './professor.repository';

@Injectable()
export class ProfessorService {
  constructor(
    private readonly repository: ProfessorRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async buscarDashboard(
    usuarioId: string,
    roles: string[] = [],
  ): Promise<DashboardProfessorResponseDto> {
    const alunos = await this.repository.buscarDashboard(usuarioId, roles);
    const hoje = new Date();

    const proximosGraduacao = alunos
      .map((a) => this.mapearGraduacaoProxima(a))
      .filter((g): g is AlunoGraduacaoProximaDto => g !== null)
      .sort((a, b) => a.frequencias_restantes - b.frequencias_restantes);

    // Evita duplicar o mesmo aluno (vínculos em várias turmas)
    const graduacoesUnicas = [
      ...new Map(
        proximosGraduacao.map((g) => [g.aluno_id, g]),
      ).values(),
    ].sort((a, b) => a.frequencias_restantes - b.frequencias_restantes);

    const proximosAniversario = alunos
      .map((a) => this.mapearAniversarioProximo(a, hoje))
      .filter((n): n is AlunoAniversarioProximoDto => n !== null)
      .sort((a, b) => a.dias_restantes - b.dias_restantes);

    // Evita duplicar o mesmo aluno (vínculos em várias turmas)
    const aniversariosUnicos = [
      ...new Map(
        proximosAniversario.map((n) => [n.aluno_id, n]),
      ).values(),
    ].sort((a, b) => a.dias_restantes - b.dias_restantes);

    return {
      proximos_graduacao: graduacoesUnicas,
      proximos_aniversario: aniversariosUnicos,
    };
  }

  private mapearGraduacaoProxima(a: {
    aluno_id: string;
    usuario_id: string;
    nome: string;
    faixa: string;
    grau_faixa: number;
    frequencia_atual: number;
    turma_id: string;
    turma_nome: string;
    frequente: string;
  }): AlunoGraduacaoProximaDto | null {
    const LIMIAR = 5;

    // A frequência é por turma e zera após a graduação.
    // Aluno pronto (>= 30) permanece no painel até ser graduado.
    const restantes =
      a.frequencia_atual >= FREQUENCIAS_POR_GRAU
        ? 0
        : FREQUENCIAS_POR_GRAU - a.frequencia_atual;

    if (restantes > LIMIAR) return null;

    return {
      aluno_id: a.aluno_id,
      usuario_id: a.usuario_id,
      nome: a.nome,
      faixa: a.faixa,
      grau_faixa: a.grau_faixa,
      frequencia_atual: a.frequencia_atual,
      frequencias_restantes: restantes,
      turma_id: a.turma_id,
      turma_nome: a.turma_nome,
      frequente: a.frequente,
    };
  }

  private mapearAniversarioProximo(
    a: {
      aluno_id: string;
      nome: string;
      faixa: string;
      data_nascimento: Date | null;
      turma_id: string;
      turma_nome: string;
      frequente: string;
    },
    hoje: Date,
  ): AlunoAniversarioProximoDto | null {
    if (!a.data_nascimento) return null;

    const dias = this.calcularDiasAteAniversario(a.data_nascimento, hoje);
    if (dias < 0 || dias > 30) return null;

    return {
      aluno_id: a.aluno_id,
      nome: a.nome,
      faixa: a.faixa,
      data_nascimento: a.data_nascimento.toISOString().split('T')[0],
      dias_restantes: dias,
      turma_id: a.turma_id,
      turma_nome: a.turma_nome,
      frequente: a.frequente,
    };
  }

  private calcularDiasAteAniversario(dataNascimento: Date, hoje: Date): number {
    const MS_DIA = 1000 * 60 * 60 * 24;

    const nasc = new Date(dataNascimento);
    const mesNasc = nasc.getUTCMonth();
    const diaNasc = nasc.getUTCDate();

    const hojeUTC = Date.UTC(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate(),
    );
    const aniversarioUTC = Date.UTC(hoje.getFullYear(), mesNasc, diaNasc);

    const dias = Math.round((aniversarioUTC - hojeUTC) / MS_DIA);

    if (dias >= 0) return dias;

    // Já passou este ano — calcular para o próximo ano
    const proximoAnoUTC = Date.UTC(hoje.getFullYear() + 1, mesNasc, diaNasc);
    return Math.round((proximoAnoUTC - hojeUTC) / MS_DIA);
  }

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    const usuarioExiste = await this.repository.usuarioExiste(dto.usuarioId);
    if (!usuarioExiste) throw new BadRequestException('Usuário não encontrado');

    const professorJaExiste = await this.repository.professorJaExiste(
      dto.usuarioId,
    );
    if (professorJaExiste)
      throw new ConflictException('Usuário já é professor');

    const entity = await this.repository.criar(dto);
    if (dto.data_nascimento) {
      await this.repository.atualizarDataNascimento(
        dto.usuarioId,
        dto.data_nascimento,
      );
    }
    return this.enriquecer(entity);
  }

  async listar(
    skip: number,
    take: number,
  ): Promise<PaginatedResult<ProfessorEntity>> {
    const { data, total } = await this.repository.listar(skip, take);
    const enriquecidos = await Promise.all(data.map((e) => this.enriquecer(e)));
    return new PaginatedResult(
      enriquecidos,
      total,
      Math.floor(skip / take) + 1,
      take,
    );
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
    if (dto.data_nascimento !== undefined) {
      await this.repository.atualizarDataNascimento(
        existente.usuarioId,
        dto.data_nascimento,
      );
    }
    const entity = await this.repository.atualizar(id, dto);
    if (!entity) throw new NotFoundException('Professor não encontrado');
    return this.enriquecer(entity);
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Professor não encontrado');
    await this.repository.deletar(id);
  }

  private async enriquecer(entity: ProfessorEntity): Promise<ProfessorEntity> {
    entity.roles = ['professor'];
    entity.permissoes = await this.authorizationService.getUserPermissions(
      entity.usuarioId,
    );
    return entity;
  }
}
