import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { UpdateAlunoDto } from './dtos/update-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

const PERFIL_ALUNO_ID = 'perfil-aluno';

@Injectable()
export class AlunoRepository {
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

  async alunoJaExiste(usuarioId: string): Promise<boolean> {
    try {
      const aluno = await this.prisma.aluno.findUnique({
        where: { usuarioId },
        select: { id: true },
      });
      return !!aluno;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao verificar aluno no banco de dados',
      );
    }
  }

  async criar(dto: CreateAlunoDto): Promise<AlunoEntity> {
    try {
      const aluno = await this.prisma.aluno.create({
        data: {
          faixa: dto.faixa ?? 'BRANCA',
          grau_faixa: dto.grau_faixa ?? 0,
          frequencia_atual: dto.frequencia_atual ?? 0,
          usuarioId: dto.usuarioId,
        },
      });
      await this.prisma.userPerfil.upsert({
        where: {
          usuario_id_perfil_id: {
            usuario_id: dto.usuarioId,
            perfil_id: PERFIL_ALUNO_ID,
          },
        },
        update: {},
        create: { usuario_id: dto.usuarioId, perfil_id: PERFIL_ALUNO_ID },
      });
      return this.toEntity(aluno);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new ConflictException('Aluno já cadastrado para este usuário');
        if (e.code === 'P2025')
          throw new NotFoundException('Usuário não encontrado');
      }
      if (e instanceof ConflictException || e instanceof NotFoundException)
        throw e;
      throw new InternalServerErrorException(
        'Erro ao criar aluno no banco de dados',
      );
    }
  }

  async listar(): Promise<AlunoEntity[]> {
    try {
      const alunos = await this.prisma.aluno.findMany();
      return alunos.map((a) => this.toEntity(a));
    } catch {
      throw new InternalServerErrorException(
        'Erro ao listar alunos no banco de dados',
      );
    }
  }

  async listarPorProfessorUsuarioId(usuarioId: string): Promise<AlunoEntity[]> {
    try {
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
        include: { aluno: true },
        distinct: ['aluno_id'],
      });

      return vinculos.map((v) => this.toEntity(v.aluno));
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Erro ao listar alunos da turma no banco de dados',
      );
    }
  }

  async buscarPorId(id: string): Promise<AlunoEntity | null> {
    try {
      const aluno = await this.prisma.aluno.findUnique({ where: { id } });
      if (!aluno) return null;
      return this.toEntity(aluno);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar aluno no banco de dados',
      );
    }
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<AlunoEntity | null> {
    try {
      const aluno = await this.prisma.aluno.findUnique({
        where: { usuarioId },
      });
      if (!aluno) return null;
      return this.toEntity(aluno);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar aluno no banco de dados',
      );
    }
  }

  async atualizar(
    id: string,
    dto: UpdateAlunoDto,
  ): Promise<AlunoEntity | null> {
    try {
      const data: Record<string, unknown> = {};
      if (dto.faixa !== undefined) data.faixa = dto.faixa;
      if (dto.grau_faixa !== undefined) data.grau_faixa = dto.grau_faixa;
      if (dto.frequencia_atual !== undefined)
        data.frequencia_atual = dto.frequencia_atual;

      const aluno = await this.prisma.aluno.update({ where: { id }, data });
      return this.toEntity(aluno);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Aluno não encontrado');
      throw new InternalServerErrorException(
        'Erro ao atualizar aluno no banco de dados',
      );
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.prisma.aluno.delete({ where: { id } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      )
        throw new NotFoundException('Aluno não encontrado');
      throw new InternalServerErrorException(
        'Erro ao deletar aluno no banco de dados',
      );
    }
  }

  private toEntity(aluno: {
    id: string;
    frequencia_atual: number;
    grau_faixa: number;
    faixa: string;
    usuarioId: string;
  }): AlunoEntity {
    const entity = new AlunoEntity();
    entity.id = aluno.id;
    entity.frequencia_atual = aluno.frequencia_atual;
    entity.grau_faixa = aluno.grau_faixa;
    entity.faixa = aluno.faixa;
    entity.usuarioId = aluno.usuarioId;
    return entity;
  }
}
