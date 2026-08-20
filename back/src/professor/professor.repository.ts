import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessorDto } from './dtos/create-professor.dto';
import { UpdateProfessorDto } from './dtos/update-professor.dto';
import { ProfessorEntity } from './entities/professor.entity';

const PERFIL_PROFESSOR_ID = 'perfil-professor';

@Injectable()
export class ProfessorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async usuarioExiste(usuarioId: string): Promise<boolean> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: { id: true },
      });
      return !!usuario;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar usuário no banco de dados',
      );
    }
  }

  async professorJaExiste(usuarioId: string): Promise<boolean> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      return !!professor;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar professor no banco de dados',
      );
    }
  }

  async atualizarDataNascimento(
    usuarioId: string,
    dataNascimento: string,
  ): Promise<void> {
    try {
      await this.prisma.usuario.update({
        where: { id: usuarioId },
        data: { data_nascimento: new Date(dataNascimento) },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao atualizar data de nascimento no banco de dados',
      );
    }
  }

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    try {
      const professor = await this.prisma.professor.create({
        data: {
          faixa: dto.faixa ?? 'BRANCA',
          grau: dto.grau ?? 0,
          usuarioId: dto.usuarioId,
        },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
              telefone: true,
              status: true,
              arquivado_at: true,
              data_nascimento: true,
            },
          },
        },
      });
      await this.prisma.userPerfil.upsert({
        where: {
          usuario_id_perfil_id: {
            usuario_id: dto.usuarioId,
            perfil_id: PERFIL_PROFESSOR_ID,
          },
        },
        update: {},
        create: { usuario_id: dto.usuarioId, perfil_id: PERFIL_PROFESSOR_ID },
      });

      // Cria registro de aluno para tracking de frequência
      await this.prisma.aluno.upsert({
        where: { usuarioId: dto.usuarioId },
        update: {},
        create: {
          faixa: dto.faixa ?? 'BRANCA',
          grau_faixa: dto.grau ?? 0,
          usuarioId: dto.usuarioId,
        },
      });

      return this.toEntity(professor);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new ConflictException(
            'Professor já cadastrado para este usuário',
          );
        if (e.code === 'P2025')
          throw new NotFoundException('Usuário não encontrado');
      }
      if (e instanceof ConflictException || e instanceof NotFoundException)
        throw e;
      throw new InternalServerErrorException(
        'Erro ao criar professor no banco de dados',
      );
    }
  }

  async listar(
    skip: number,
    take: number,
  ): Promise<{ data: ProfessorEntity[]; total: number }> {
    try {
      const where = {};
      const [professores, total] = await Promise.all([
        this.prisma.professor.findMany({
          where,
          skip,
          take,
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
                telefone: true,
                status: true,
                arquivado_at: true,
                data_nascimento: true,
              },
            },
          },
        }),
        this.prisma.professor.count({ where }),
      ]);
      return { data: professores.map((p) => this.toEntity(p)), total };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar professores no banco de dados',
      );
    }
  }

  async buscarPorId(id: string): Promise<ProfessorEntity | null> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
              telefone: true,
              status: true,
              arquivado_at: true,
              data_nascimento: true,
            },
          },
        },
      });
      if (!professor) return null;
      return this.toEntity(professor);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar professor no banco de dados',
      );
    }
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<ProfessorEntity | null> {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
              telefone: true,
              status: true,
              arquivado_at: true,
              data_nascimento: true,
            },
          },
        },
      });
      if (!professor) return null;
      return this.toEntity(professor);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar professor no banco de dados',
      );
    }
  }

  async atualizar(
    id: string,
    dto: UpdateProfessorDto,
  ): Promise<ProfessorEntity | null> {
    try {
      const data: Record<string, unknown> = {};
      if (dto.faixa !== undefined) data.faixa = dto.faixa;
      if (dto.grau !== undefined) data.grau = dto.grau;
      const professor = await this.prisma.professor.update({
        where: { id },
        data,
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
              telefone: true,
              status: true,
              arquivado_at: true,
              data_nascimento: true,
            },
          },
        },
      });
      return this.toEntity(professor);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Professor não encontrado');
      throw new InternalServerErrorException(
        'Erro ao atualizar professor no banco de dados',
      );
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.prisma.$transaction([
        this.prisma.professorTurma.deleteMany({ where: { professor_id: id } }),
        this.prisma.frequenciaProf.deleteMany({ where: { professor_id: id } }),
        this.prisma.frequenciaAluno.deleteMany({ where: { professor_id: id } }),
        this.prisma.notificacao.deleteMany({ where: { professor_id: id } }),
        this.prisma.professor.delete({ where: { id } }),
      ]);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Professor não encontrado');
      throw new InternalServerErrorException(
        'Erro ao deletar professor no banco de dados',
      );
    }
  }

  async buscarDashboard(
    usuarioId: string,
    roles: string[] = [],
  ): Promise<
    {
      aluno_id: string;
      usuario_id: string;
      nome: string;
      faixa: string;
      grau_faixa: number;
      frequencia_atual: number;
      data_nascimento: Date | null;
      turma_id: string;
      turma_nome: string;
      frequente: string;
    }[]
  > {
    try {
      if (roles.includes('admin')) {
        const vinculos = await this.prisma.alunoTurma.findMany({
          include: {
            aluno: {
              include: {
                usuario: { select: { nome: true, data_nascimento: true } },
              },
            },
            turma: { select: { nome: true } },
          },
        });

        return vinculos.map((v) => ({
          aluno_id: v.aluno_id,
          usuario_id: v.aluno.usuarioId,
          nome: v.aluno.usuario.nome,
          faixa: v.aluno.faixa,
          grau_faixa: v.aluno.grau_faixa,
          frequencia_atual: v.aluno.frequencia_atual,
          data_nascimento: v.aluno.usuario.data_nascimento,
          turma_id: v.turma_id,
          turma_nome: v.turma.nome,
          frequente: v.frequente,
        }));
      }

      const professor = await this.prisma.professor.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      if (!professor) return [];

      const vinculos = await this.prisma.alunoTurma.findMany({
        where: {
          turma: {
            professorTurmas: {
              some: { professor_id: professor.id },
            },
          },
        },
        include: {
          aluno: {
            include: {
              usuario: { select: { nome: true, data_nascimento: true } },
            },
          },
          turma: { select: { nome: true } },
        },
      });

      return vinculos.map((v) => ({
        aluno_id: v.aluno_id,
        usuario_id: v.aluno.usuarioId,
        nome: v.aluno.usuario.nome,
        faixa: v.aluno.faixa,
        grau_faixa: v.aluno.grau_faixa,
        frequencia_atual: v.aluno.frequencia_atual,
        data_nascimento: v.aluno.usuario.data_nascimento,
        turma_id: v.turma_id,
        turma_nome: v.turma.nome,
        frequente: v.frequente,
      }));
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar dashboard do professor',
      );
    }
  }

  private toEntity(professor: {
    id: string;
    faixa: string;
    grau: number;
    usuarioId: string;
    usuario?: {
      nome: string;
      email: string;
      telefone: string | null;
      data_nascimento: Date | null;
      status: string;
      arquivado_at: Date | null;
    };
  }): ProfessorEntity {
    const entity = new ProfessorEntity();
    entity.id = professor.id;
    entity.faixa = professor.faixa;
    entity.grau = professor.grau;
    entity.usuarioId = professor.usuarioId;
    if (professor.usuario) {
      entity.nome = professor.usuario.nome;
      entity.email = professor.usuario.email;
      entity.telefone = professor.usuario.telefone;
      entity.data_nascimento = professor.usuario.data_nascimento;
      entity.status = professor.usuario.status;
      entity.arquivado_at = professor.usuario.arquivado_at;
    }
    return entity;
  }
}
