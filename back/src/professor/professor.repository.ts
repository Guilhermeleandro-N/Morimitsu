import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AlunoEntity } from '../aluno/entities/aluno.entity';
import { PainelTurmaItem } from './dtos/painel-professor.dto';
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

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    try {
      const professor = await this.prisma.professor.create({
        data: {
          faixa: dto.faixa ?? 'BRANCA',
          grau: dto.grau ?? 0,
          usuarioId: dto.usuarioId,
        },
        include: {
          usuario: { select: { nome: true, email: true, telefone: true } },
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

  async listar(): Promise<ProfessorEntity[]> {
    try {
      const professores = await this.prisma.professor.findMany({
        include: {
          usuario: { select: { nome: true, email: true, telefone: true } },
        },
      });
      return professores.map((p) => this.toEntity(p));
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
          usuario: { select: { nome: true, email: true, telefone: true } },
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
          usuario: { select: { nome: true, email: true, telefone: true } },
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
          usuario: { select: { nome: true, email: true, telefone: true } },
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
      await this.prisma.professor.delete({ where: { id } });
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

  async buscarPainel(professorId: string): Promise<PainelTurmaItem[]> {
    try {
      const vinculos = await this.prisma.professorTurma.findMany({
        where: { professor_id: professorId },
        include: { turma: true },
      });

      const now = new Date();
      const mesAtual = now.getMonth(); // 0-11
      const mesSeguinte = (mesAtual + 1) % 12;

      const itens: PainelTurmaItem[] = [];

      for (const v of vinculos) {
        const todosAlunos = await this.prisma.alunoTurma.findMany({
          where: { turma_id: v.turma_id, arquivado: false },
          include: {
            aluno: {
              include: {
                usuario: {
                  select: { nome: true, email: true, telefone: true },
                },
              },
            },
          },
        });

        const proximosGraduacao = todosAlunos
          .filter((at) => at.aluno.frequencia_atual >= 25)
          .map((at) => this.alunoTurmaToAlunoEntity(at));

        const aniversariantes = todosAlunos
          .filter((at) => {
            const nasc = at.aluno.data_nascimento;
            if (!nasc) return false;
            const mesNasc = nasc.getMonth();
            return mesNasc === mesAtual || mesNasc === mesSeguinte;
          })
          .map((at) => this.alunoTurmaToAlunoEntity(at));

        itens.push({
          turma_id: v.turma_id,
          turma_nome: v.turma.nome,
          proximos_graduacao: proximosGraduacao,
          aniversariantes,
          total_alunos_ativos: todosAlunos.length,
        });
      }

      return itens;
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar painel do professor no banco de dados',
      );
    }
  }

  private alunoTurmaToAlunoEntity(v: {
    frequente: string;
    aluno: {
      id: string;
      frequencia_atual: number;
      grau_faixa: number;
      faixa: string;
      data_nascimento: Date | null;
      usuarioId: string;
      usuario: { nome: string; email: string; telefone: string | null };
    };
  }) {
    const entity = new AlunoEntity();
    entity.id = v.aluno.id;
    entity.frequencia_atual = v.aluno.frequencia_atual;
    entity.grau_faixa = v.aluno.grau_faixa;
    entity.faixa = v.aluno.faixa;
    entity.data_nascimento = v.aluno.data_nascimento;
    entity.usuarioId = v.aluno.usuarioId;
    entity.nome = v.aluno.usuario.nome;
    entity.email = v.aluno.usuario.email;
    entity.telefone = v.aluno.usuario.telefone;
    entity.frequente = v.frequente;
    return entity;
  }

  private toEntity(professor: {
    id: string;
    faixa: string;
    grau: number;
    usuarioId: string;
    usuario?: { nome: string; email: string; telefone: string | null };
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
    }
    return entity;
  }
}
