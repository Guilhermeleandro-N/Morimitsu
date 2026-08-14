import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFrequenciaProfDto } from './dtos/create-frequencia-prof.dto';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto';
import { UpdateFrequenciaProfDto } from './dtos/update-frequencia-prof.dto';
import { UpdateFrequenciaDto } from './dtos/update-frequencia.dto';
import { FrequenciaProfEntity } from './entities/frequencia-prof.entity';
import { FrequenciaEntity } from './entities/frequencia.entity';
import {
  FREQUENCIAS_POR_GRAU,
} from '../common/faixas.constants';

export interface GraduacaoResultado {
  novoGrau: number;
  novaFaixa: string;
  graduou: boolean;
}

@Injectable()
export class FrequenciaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(dto: CreateFrequenciaDto): Promise<{
    frequencia: FrequenciaEntity;
    graduacao: GraduacaoResultado | null;
  }> {
    try {
      const frequencia = await this.prisma.frequenciaAluno.create({
        data: dto,
      });

      if (dto.status_presenca !== 'PRESENTE') {
        return { frequencia: this.toEntity(frequencia), graduacao: null };
      }

      await this.prisma.aluno.update({
        where: { id: dto.aluno_id },
        data: { frequencia_atual: { increment: 1 } },
      });

      await this.incrementarFrequencia(dto.aluno_id, dto.turma_id);

      await this.notificarAniversario(dto.aluno_id, dto.turma_id);

      const graduacao = await this.verificarGraduacao(
        dto.aluno_id,
        dto.turma_id,
      );

      return { frequencia: this.toEntity(frequencia), graduacao };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      )
        throw new NotFoundException('Aluno, professor ou turma não encontrado');
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Erro ao registrar frequência no banco de dados',
      );
    }
  }

  async relatorioTreino(
    professorId: string,
    turmaId: string,
    alunosPresentes: string[],
  ): Promise<{
    treino: FrequenciaProfEntity;
    frequencias: FrequenciaEntity[];
  }> {
    const agora = new Date();
    const inicio = new Date(agora.getTime() - 2 * 60 * 60 * 1000);

    const treino = await this.prisma.frequenciaProf.create({
      data: {
        professor_id: professorId,
        turma_id: turmaId,
        data: agora,
        status_aula: 'REALIZADA',
      },
    });

    const frequencias: FrequenciaEntity[] = [];

    for (const alunoId of alunosPresentes) {
      const freq = await this.prisma.frequenciaAluno.create({
        data: {
          aluno_id: alunoId,
          professor_id: professorId,
          turma_id: turmaId,
          data: agora,
          horario_inicio: inicio,
          horario_fim: agora,
          status_presenca: 'PRESENTE',
        },
      });

      const aluno = await this.prisma.aluno.update({
        where: { id: alunoId },
        data: { frequencia_atual: { increment: 1 } },
      });

      await this.incrementarFrequencia(alunoId, turmaId);

      await this.notificarAniversario(alunoId, turmaId);

      await this.verificarGraduacao(alunoId, turmaId);

      frequencias.push(this.toEntity(freq));
    }

    return { treino: this.toEntityProf(treino), frequencias };
  }

  async atualizar(
    id: string,
    dto: UpdateFrequenciaDto,
  ): Promise<FrequenciaEntity> {
    try {
      const atual = await this.prisma.frequenciaAluno.findUnique({
        where: { id },
      });
      if (!atual) throw new NotFoundException('Frequência não encontrada');

      const statusMudou =
        dto.status_presenca !== undefined &&
        dto.status_presenca !== atual.status_presenca;

      const frequencia = await this.prisma.frequenciaAluno.update({
        where: { id },
        data: {
          ...(dto.status_presenca !== undefined && {
            status_presenca: dto.status_presenca,
          }),
          ...(dto.data !== undefined && { data: dto.data }),
          ...(dto.horario_inicio !== undefined && {
            horario_inicio: dto.horario_inicio,
          }),
          ...(dto.horario_fim !== undefined && {
            horario_fim: dto.horario_fim,
          }),
        },
      });

      if (statusMudou) {
        if (
          dto.status_presenca === 'PRESENTE' &&
          atual.status_presenca === 'AUSENTE'
        ) {
          const aluno = await this.prisma.aluno.update({
            where: { id: atual.aluno_id },
            data: { frequencia_atual: { increment: 1 } },
          });

          await this.incrementarFrequencia(atual.aluno_id, atual.turma_id);

          await this.notificarAniversario(atual.aluno_id, atual.turma_id);

          await this.verificarGraduacao(atual.aluno_id, atual.turma_id);
        } else if (
          dto.status_presenca === 'AUSENTE' &&
          atual.status_presenca === 'PRESENTE'
        ) {
          await this.prisma.aluno.update({
            where: { id: atual.aluno_id },
            data: { frequencia_atual: { decrement: 1 } },
          });

          await this.decrementarFrequencia(atual.aluno_id, atual.turma_id);
        }
      }

      return this.toEntity(frequencia);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Frequência não encontrada');
      throw new InternalServerErrorException(
        'Erro ao atualizar frequência no banco de dados',
      );
    }
  }

  private async incrementarFrequencia(
    alunoId: string,
    turmaId: string,
  ): Promise<void> {
    await this.prisma.alunoTurma.updateMany({
      where: { aluno_id: alunoId, turma_id: turmaId },
      data: { frequencia_atual: { increment: 1 } },
    });
  }

  private async decrementarFrequencia(
    alunoId: string,
    turmaId: string,
  ): Promise<void> {
    await this.prisma.alunoTurma.updateMany({
      where: { aluno_id: alunoId, turma_id: turmaId },
      data: { frequencia_atual: { decrement: 1 } },
    });
  }

  private async verificarGraduacao(
    alunoId: string,
    turmaId: string,
  ): Promise<GraduacaoResultado | null> {
    // A graduação é manual: somente o admin ou o professor responsável
    // pode graduar o aluno. Aqui apenas notificamos os professores quando
    // o aluno se aproxima (faltando 5..1 frequências) ou atinge os 30
    // frequências na turma (pronto para graduar).
    const [vinculo, aluno] = await Promise.all([
      this.prisma.alunoTurma.findUnique({
        where: { aluno_id_turma_id: { aluno_id: alunoId, turma_id: turmaId } },
        select: { frequencia_atual: true },
      }),
      this.prisma.aluno.findUnique({
        where: { id: alunoId },
        select: { usuario: { select: { nome: true } } },
      }),
    ]);

    const frequenciaTurma = vinculo?.frequencia_atual ?? 0;
    if (frequenciaTurma === 0) return null;

    const nome = aluno?.usuario?.nome ?? 'Aluno';
    const resto = frequenciaTurma % FREQUENCIAS_POR_GRAU;

    let mensagem: string;
    if (resto === 0) {
      mensagem = `${nome} já possui ${frequenciaTurma} frequências, o aluno já deve ser graduado`;
    } else if (resto >= FREQUENCIAS_POR_GRAU - 5) {
      const restantes = FREQUENCIAS_POR_GRAU - resto;
      mensagem = `Falta ${restantes} frequência${
        restantes === 1 ? '' : 's'
      } para o aluno ${nome} se graduar`;
    } else {
      return null;
    }

    // Notificar todos os professores da turma
    const professorTurmas = await this.prisma.professorTurma.findMany({
      where: { turma_id: turmaId },
      select: { professor_id: true },
    });

    if (professorTurmas.length > 0) {
      await this.prisma.notificacao.createMany({
        data: professorTurmas.map((pt) => ({
          professor_id: pt.professor_id,
          aluno_id: alunoId,
          mensagem,
          tipo: 'graduacao',
        })),
      });
    }

    return null;
  }

  private async notificarAniversario(
    alunoId: string,
    turmaId: string,
  ): Promise<void> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id: alunoId },
      select: {
        usuario: { select: { nome: true, data_nascimento: true } },
      },
    });

    const nascimento = aluno?.usuario?.data_nascimento;
    if (!nascimento) return;

    const hoje = new Date();
    if (
      nascimento.getDate() !== hoje.getDate() ||
      nascimento.getMonth() !== hoje.getMonth()
    )
      return;

    const professorTurmas = await this.prisma.professorTurma.findMany({
      where: { turma_id: turmaId },
      select: { professor_id: true },
    });

    if (professorTurmas.length === 0) return;

    const mensagem = `Hoje é o aniversário de ${aluno?.usuario?.nome}!`;

    await this.prisma.notificacao.createMany({
      data: professorTurmas.map((pt) => ({
        professor_id: pt.professor_id,
        aluno_id: alunoId,
        mensagem,
        tipo: 'aniversario',
      })),
    });
  }

  async listarPorAluno(
    alunoId: string,
    skip: number,
    take: number,
  ): Promise<{ data: FrequenciaEntity[]; total: number }> {
    try {
      const where = { aluno_id: alunoId };
      const [frequencias, total] = await Promise.all([
        this.prisma.frequenciaAluno.findMany({
          where,
          skip,
          take,
          orderBy: { data: 'desc' },
        }),
        this.prisma.frequenciaAluno.count({ where }),
      ]);
      return { data: frequencias.map((f) => this.toEntity(f)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar frequências no banco de dados',
      );
    }
  }

  async listarPorTurma(
    turmaId: string,
    skip: number,
    take: number,
  ): Promise<{ data: FrequenciaEntity[]; total: number }> {
    try {
      const where = { turma_id: turmaId };
      const [frequencias, total] = await Promise.all([
        this.prisma.frequenciaAluno.findMany({
          where,
          skip,
          take,
          orderBy: { data: 'desc' },
        }),
        this.prisma.frequenciaAluno.count({ where }),
      ]);
      return { data: frequencias.map((f) => this.toEntity(f)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar frequências da turma no banco de dados',
      );
    }
  }

  async listarPorMinhasTurmas(
    professorUsuarioId: string,
    filtros?: {
      turma_id?: string;
      aluno_id?: string;
      data_inicio?: Date;
      data_fim?: Date;
      frequente?: string;
    },
    skip = 0,
    take = 10,
  ): Promise<{ data: FrequenciaEntity[]; total: number }> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId: professorUsuarioId },
        select: { id: true },
      });
      if (!professor) return { data: [], total: 0 };

      const turmasDoProfessor = await this.prisma.professorTurma.findMany({
        where: { professor_id: professor.id },
        select: { turma_id: true },
      });
      const turmaIds = turmasDoProfessor.map((t) => t.turma_id);

      if (turmaIds.length === 0) return { data: [], total: 0 };

      const where: Prisma.FrequenciaAlunoWhereInput = {
        turma_id: filtros?.turma_id ? filtros.turma_id : { in: turmaIds },
      };

      if (filtros?.aluno_id) {
        where.aluno_id = filtros.aluno_id;
      }

      if (filtros?.data_inicio || filtros?.data_fim) {
        where.data = {};
        if (filtros.data_inicio) where.data.gte = filtros.data_inicio;
        if (filtros.data_fim) where.data.lte = filtros.data_fim;
      }

      if (filtros?.frequente) {
        where.aluno = {
          alunoTurmas: {
            some: {
              turma_id: where.turma_id as string,
              frequente: filtros.frequente,
            },
          },
        };
      }

      const [frequencias, total] = await Promise.all([
        this.prisma.frequenciaAluno.findMany({
          where,
          skip,
          take,
          orderBy: { data: 'desc' },
        }),
        this.prisma.frequenciaAluno.count({ where }),
      ]);

      return { data: frequencias.map((f) => this.toEntity(f)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar frequências das turmas do professor',
      );
    }
  }

  async professorExisteNaTurma(
    professorId: string,
    turmaId: string,
  ): Promise<boolean> {
    try {
      const vinculo = await this.prisma.professorTurma.findUnique({
        where: {
          professor_id_turma_id: {
            professor_id: professorId,
            turma_id: turmaId,
          },
        },
      });
      return !!vinculo;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar vínculo professor-turma no banco de dados',
      );
    }
  }

  async buscarProfessorPorUsuarioId(
    usuarioId: string,
  ): Promise<{ id: string } | null> {
    try {
      return this.prisma.professor.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar professor pelo usuário',
      );
    }
  }

  async alunoEstaAtivoNaTurma(
    alunoId: string,
    turmaId: string,
  ): Promise<boolean> {
    try {
      const vinculo = await this.prisma.alunoTurma.findUnique({
        where: { aluno_id_turma_id: { aluno_id: alunoId, turma_id: turmaId } },
        select: { frequente: true },
      });
      return vinculo?.frequente === 'S';
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar status do aluno na turma',
      );
    }
  }

  async alunoExisteNaTurma(alunoId: string, turmaId: string): Promise<boolean> {
    try {
      const vinculo = await this.prisma.alunoTurma.findUnique({
        where: { aluno_id_turma_id: { aluno_id: alunoId, turma_id: turmaId } },
      });
      return !!vinculo;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar vínculo aluno-turma no banco de dados',
      );
    }
  }

  async alunoTemVinculoComProfessor(
    alunoId: string,
    professorUsuarioId: string,
  ): Promise<boolean> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId: professorUsuarioId },
        select: { id: true },
      });
      if (!professor) return false;

      const vinculo = await this.prisma.alunoTurma.findFirst({
        where: {
          aluno_id: alunoId,
          turma: {
            professorTurmas: {
              some: { professor_id: professor.id },
            },
          },
        },
      });
      return !!vinculo;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar vínculo aluno-professor no banco de dados',
      );
    }
  }

  // Verifica se o aluno pertence ao usuário logado (perfil do próprio aluno).
  async alunoPertenceAoUsuario(
    alunoId: string,
    usuarioId: string,
  ): Promise<boolean> {
    try {
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: alunoId, usuarioId },
        select: { id: true },
      });
      return !!aluno;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar aluno no banco de dados',
      );
    }
  }

  // FrequenciaProf
  async registrarTreino(
    dto: CreateFrequenciaProfDto,
  ): Promise<FrequenciaProfEntity> {
    try {
      const treino = await this.prisma.frequenciaProf.create({ data: dto });

      // Notifica os alunos da turma sobre o treino marcado
      await this.notificarAlunosDoTreino(dto.professor_id, dto.turma_id, dto.data);

      return this.toEntityProf(treino);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new ConflictException('Treino já registrado para este horário');
        if (e.code === 'P2003')
          throw new NotFoundException('Professor ou turma não encontrado');
      }
      throw new InternalServerErrorException(
        'Erro ao registrar treino no banco de dados',
      );
    }
  }

  // Cria notificações para todos os alunos ativos da turma quando
  // um treino é marcado pelo professor.
  private async notificarAlunosDoTreino(
    professorId: string,
    turmaId: string,
    dataTreino: Date,
  ): Promise<void> {
    const [turma, vinculos] = await Promise.all([
      this.prisma.turma.findUnique({
        where: { id: turmaId },
        select: { nome: true },
      }),
      this.prisma.alunoTurma.findMany({
        where: { turma_id: turmaId, frequente: 'S' },
        select: { aluno_id: true },
      }),
    ]);

    if (vinculos.length === 0) return;

    const dataFormatada = dataTreino.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const mensagem = `Treino marcado para o dia ${dataFormatada} na turma ${turma?.nome ?? ''}`;

    await this.prisma.notificacao.createMany({
      data: vinculos.map((v) => ({
        professor_id: professorId,
        aluno_id: v.aluno_id,
        mensagem,
        tipo: 'treino',
      })),
    });
  }

  async atualizarTreino(
    id: string,
    dto: UpdateFrequenciaProfDto,
  ): Promise<FrequenciaProfEntity> {
    try {
      const treino = await this.prisma.frequenciaProf.update({
        where: { id },
        data: {
          ...(dto.status_aula !== undefined && {
            status_aula: dto.status_aula,
          }),
          ...(dto.data !== undefined && { data: dto.data }),
          ...(dto.data_remarcacao !== undefined && {
            data_remarcacao: dto.data_remarcacao,
          }),
        },
      });
      return this.toEntityProf(treino);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Treino não encontrado');
      throw new InternalServerErrorException(
        'Erro ao atualizar treino no banco de dados',
      );
    }
  }

  async listarTreinosPorProfessor(
    professorId: string,
    skip: number,
    take: number,
  ): Promise<{ data: FrequenciaProfEntity[]; total: number }> {
    try {
      const where = { professor_id: professorId };
      const [treinos, total] = await Promise.all([
        this.prisma.frequenciaProf.findMany({
          where,
          skip,
          take,
          orderBy: { data: 'desc' },
        }),
        this.prisma.frequenciaProf.count({ where }),
      ]);
      return { data: treinos.map((t) => this.toEntityProf(t)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar treinos no banco de dados',
      );
    }
  }

  async listarTreinosPorTurma(
    turmaId: string,
    skip: number,
    take: number,
  ): Promise<{ data: FrequenciaProfEntity[]; total: number }> {
    try {
      const where = { turma_id: turmaId };
      const [treinos, total] = await Promise.all([
        this.prisma.frequenciaProf.findMany({
          where,
          skip,
          take,
          orderBy: { data: 'desc' },
        }),
        this.prisma.frequenciaProf.count({ where }),
      ]);
      return { data: treinos.map((t) => this.toEntityProf(t)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar treinos da turma no banco de dados',
      );
    }
  }

  private toEntity(f: {
    id: string;
    aluno_id: string;
    professor_id: string;
    turma_id: string;
    data: Date;
    horario_inicio: Date;
    horario_fim: Date;
    status_presenca: string;
  }): FrequenciaEntity {
    const entity = new FrequenciaEntity();
    entity.id = f.id;
    entity.aluno_id = f.aluno_id;
    entity.professor_id = f.professor_id;
    entity.turma_id = f.turma_id;
    entity.data = f.data;
    entity.horario_inicio = f.horario_inicio;
    entity.horario_fim = f.horario_fim;
    entity.status_presenca = f.status_presenca;
    return entity;
  }

  private toEntityProf(f: {
    id: string;
    professor_id: string;
    turma_id: string;
    data: Date;
    status_aula: string;
    data_remarcacao: Date | null;
  }): FrequenciaProfEntity {
    const entity = new FrequenciaProfEntity();
    entity.id = f.id;
    entity.professor_id = f.professor_id;
    entity.turma_id = f.turma_id;
    entity.data = f.data;
    entity.status_aula = f.status_aula;
    entity.data_remarcacao = f.data_remarcacao;
    return entity;
  }
}
