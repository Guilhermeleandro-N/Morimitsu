import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AlunoEntity } from '../aluno/entities/aluno.entity';
import { ProfessorEntity } from '../professor/entities/professor.entity';
import { AddAlunoTurmaDto } from './dtos/add-aluno-turma.dto';
import { AddProfessorTurmaDto } from './dtos/add-professor-turma.dto';
import { CreateTurmaDto } from './dtos/create-turma.dto';
import { UpdateAlunoTurmaDto } from './dtos/update-aluno-turma.dto';
import { UpdateTurmaDto } from './dtos/update-turma.dto';
import { TurmaEntity } from './entities/turma.entity';

@Injectable()
export class TurmaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateTurmaDto): Promise<TurmaEntity> {
    try {
      const turma = await this.prisma.turma.create({ data: dto });
      return this.toEntity(turma);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      )
        throw new ConflictException('Turma já cadastrada com este nome');
      throw new InternalServerErrorException(
        'Erro ao criar turma no banco de dados',
      );
    }
  }

  async listar(
    skip: number,
    take: number,
    usuarioId?: string,
    roles: string[] = [],
  ): Promise<{ data: TurmaEntity[]; total: number }> {
    try {
      const where = this.montarFiltroPorUsuario(usuarioId, roles, {
        status: 'ATIVO',
      });
      const [turmas, total] = await Promise.all([
        this.prisma.turma.findMany({
          where,
          skip,
          take,
          include: {
            professorTurmas: {
              include: {
                professor: {
                  include: {
                    usuario: { select: { nome: true } },
                  },
                },
              },
            },
          },
        }),
        this.prisma.turma.count({ where }),
      ]);
      return { data: turmas.map((t) => this.toEntity(t)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar turmas no banco de dados',
      );
    }
  }

  async listarArquivadas(
    skip: number,
    take: number,
    usuarioId?: string,
    roles: string[] = [],
  ): Promise<{ data: TurmaEntity[]; total: number }> {
    try {
      const where = this.montarFiltroPorUsuario(usuarioId, roles, {
        status: { in: ['ARQUIVADA', 'INATIVO'] },
      });
      const [turmas, total] = await Promise.all([
        this.prisma.turma.findMany({
          where,
          skip,
          take,
          include: {
            professorTurmas: {
              include: {
                professor: {
                  include: {
                    usuario: { select: { nome: true } },
                  },
                },
              },
            },
          },
        }),
        this.prisma.turma.count({ where }),
      ]);
      return { data: turmas.map((t) => this.toEntity(t)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar turmas arquivadas no banco de dados',
      );
    }
  }

  // Admin vê todas; professor vê as que ministra/participa;
  // aluno vê apenas as que participa.
  private montarFiltroPorUsuario(
    usuarioId: string | undefined,
    roles: string[],
    base: Prisma.TurmaWhereInput,
  ): Prisma.TurmaWhereInput {
    if (!usuarioId || roles.includes('admin')) return base;

    const or: Prisma.TurmaWhereInput[] = [];

    if (roles.includes('professor')) {
      or.push({
        professorTurmas: { some: { professor: { usuarioId } } },
      });
    }

    if (roles.includes('aluno')) {
      or.push({
        alunoTurmas: { some: { aluno: { usuarioId } } },
      });
    }

    if (or.length === 0) {
      return { ...base, id: 'sem-acesso' };
    }

    return { ...base, OR: or };
  }

  async arquivar(id: string): Promise<TurmaEntity | null> {
    try {
      const turma = await this.prisma.turma.update({
        where: { id },
        data: { status: 'ARQUIVADA', arquivada_em: new Date() },
      });
      return this.toEntity(turma);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Turma não encontrada');
      throw new InternalServerErrorException(
        'Erro ao arquivar turma no banco de dados',
      );
    }
  }

  async reativar(id: string): Promise<TurmaEntity | null> {
    try {
      const turma = await this.prisma.turma.update({
        where: { id },
        data: { status: 'ATIVO', arquivada_em: null },
      });
      return this.toEntity(turma);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Turma não encontrada');
      throw new InternalServerErrorException(
        'Erro ao reativar turma no banco de dados',
      );
    }
  }

  async atualizarStatus(
    id: string,
    status: string,
  ): Promise<TurmaEntity | null> {
    try {
      const turma = await this.prisma.turma.update({
        where: { id },
        data: {
          status,
          arquivada_em: status === 'INATIVO' ? new Date() : null,
        },
      });
      return this.toEntity(turma);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Turma não encontrada');
      throw new InternalServerErrorException(
        'Erro ao atualizar status da turma no banco de dados',
      );
    }
  }

  async buscarPorId(id: string): Promise<TurmaEntity | null> {
    try {
      const turma = await this.prisma.turma.findUnique({ where: { id } });
      if (!turma) return null;
      return this.toEntity(turma);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar turma no banco de dados',
      );
    }
  }

  async atualizar(
    id: string,
    dto: UpdateTurmaDto,
  ): Promise<TurmaEntity | null> {
    try {
      const turma = await this.prisma.turma.update({
        where: { id },
        data: dto,
      });
      return this.toEntity(turma);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Turma não encontrada');
      throw new InternalServerErrorException(
        'Erro ao atualizar turma no banco de dados',
      );
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.prisma.$transaction([
        this.prisma.alunoTurma.deleteMany({ where: { turma_id: id } }),
        this.prisma.professorTurma.deleteMany({ where: { turma_id: id } }),
        this.prisma.frequenciaAluno.deleteMany({ where: { turma_id: id } }),
        this.prisma.frequenciaProf.deleteMany({ where: { turma_id: id } }),
        this.prisma.turma.delete({ where: { id } }),
      ]);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Turma não encontrada');
      throw new InternalServerErrorException(
        'Erro ao deletar turma no banco de dados',
      );
    }
  }

  async adicionarAluno(turmaId: string, dto: AddAlunoTurmaDto): Promise<void> {
    try {
      const frequente = dto.frequente ?? 'S';
      await this.prisma.alunoTurma.upsert({
        where: {
          aluno_id_turma_id: { aluno_id: dto.aluno_id, turma_id: turmaId },
        },
        update: { frequente },
        create: { aluno_id: dto.aluno_id, turma_id: turmaId, frequente },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      )
        throw new NotFoundException('Aluno ou turma não encontrado');
      throw new InternalServerErrorException(
        'Erro ao adicionar aluno à turma no banco de dados',
      );
    }
  }

  async atualizarAlunoNaTurma(
    turmaId: string,
    alunoId: string,
    dto: UpdateAlunoTurmaDto,
  ): Promise<void> {
    try {
      await this.prisma.alunoTurma.update({
        where: {
          aluno_id_turma_id: { aluno_id: alunoId, turma_id: turmaId },
        },
        data: { frequente: dto.frequente },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Vínculo aluno-turma não encontrado');
      throw new InternalServerErrorException(
        'Erro ao atualizar vínculo aluno-turma no banco de dados',
      );
    }
  }

  async adicionarProfessor(
    turmaId: string,
    dto: AddProfessorTurmaDto,
  ): Promise<void> {
    try {
      await this.prisma.professorTurma.upsert({
        where: {
          professor_id_turma_id: {
            professor_id: dto.professor_id,
            turma_id: turmaId,
          },
        },
        update: {},
        create: { professor_id: dto.professor_id, turma_id: turmaId },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      )
        throw new NotFoundException('Professor ou turma não encontrado');
      throw new InternalServerErrorException(
        'Erro ao adicionar professor à turma no banco de dados',
      );
    }
  }

  async listarAlunosDaTurma(
    turmaId: string,
    skip: number,
    take: number,
  ): Promise<{ data: AlunoEntity[]; total: number }> {
    try {
      const where = { turma_id: turmaId };
      const [vinculos, total] = await Promise.all([
        this.prisma.alunoTurma.findMany({
          where,
          skip,
          take,
          include: { aluno: true },
        }),
        this.prisma.alunoTurma.count({ where }),
      ]);

      return {
        data: vinculos.map((v) => {
          const entity = new AlunoEntity();
          entity.id = v.aluno.id;
          entity.frequencia_atual = v.frequencia_atual;
          entity.grau_faixa = v.aluno.grau_faixa;
          entity.faixa = v.aluno.faixa;
          entity.usuarioId = v.aluno.usuarioId;
          entity.frequente = v.frequente;
          return entity;
        }),
        total,
      };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar alunos da turma no banco de dados',
      );
    }
  }

  async listarProfessoresDaTurma(
    turmaId: string,
    skip: number,
    take: number,
  ): Promise<{ data: ProfessorEntity[]; total: number }> {
    try {
      const where = { turma_id: turmaId };
      const [vinculos, total] = await Promise.all([
        this.prisma.professorTurma.findMany({
          where,
          skip,
          take,
          include: { professor: true },
        }),
        this.prisma.professorTurma.count({ where }),
      ]);
      return {
        data: vinculos.map((v) => {
          const entity = new ProfessorEntity();
          entity.id = v.professor.id;
          entity.faixa = v.professor.faixa;
          entity.grau = v.professor.grau;
          entity.usuarioId = v.professor.usuarioId;
          return entity;
        }),
        total,
      };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar professores da turma no banco de dados',
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

  async removerAlunoDaTurma(turmaId: string, alunoId: string): Promise<void> {
    try {
      await this.prisma.alunoTurma.delete({
        where: { aluno_id_turma_id: { aluno_id: alunoId, turma_id: turmaId } },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Vínculo aluno-turma não encontrado');
      throw new InternalServerErrorException(
        'Erro ao remover aluno da turma no banco de dados',
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

  private toEntity(turma: {
    id: string;
    nome: string;
    horario_inicio: Date;
    horario_fim: Date;
    status?: string;
    arquivada_em: Date | null;
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
    professorTurmas?: Array<{
      professor: { usuario: { nome: string } };
    }>;
  }): TurmaEntity {
    const entity = new TurmaEntity();
    entity.id = turma.id;
    entity.nome = turma.nome;
    entity.horario_inicio = turma.horario_inicio;
    entity.horario_fim = turma.horario_fim;
    entity.status = turma.status ?? 'ATIVO';
    entity.arquivada_em = turma.arquivada_em ?? null;
    entity.segunda = turma.segunda;
    entity.terca = turma.terca;
    entity.quarta = turma.quarta;
    entity.quinta = turma.quinta;
    entity.sexta = turma.sexta;
    entity.sabado = turma.sabado;
    entity.domingo = turma.domingo;
    entity.professores = turma.professorTurmas?.map(
      (pt) => pt.professor.usuario.nome,
    );
    return entity;
  }
}
