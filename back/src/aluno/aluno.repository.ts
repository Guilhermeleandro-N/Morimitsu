import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

const PERFIL_ALUNO_ID = 'perfil-aluno';

@Injectable()
export class AlunoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async usuarioExiste(usuarioId: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true },
    });
    return !!usuario;
  }

  async alunoJaExiste(usuarioId: string): Promise<boolean> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { usuarioId },
      select: { id: true },
    });
    return !!aluno;
  }

  async criar(dto: CreateAlunoDto): Promise<AlunoEntity> {
    const aluno = await this.prisma.aluno.create({
      data: {
        faixa: dto.faixa ?? 'BRANCA',
        grau_faixa: dto.grau_faixa ?? 0,
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
      create: {
        usuario_id: dto.usuarioId,
        perfil_id: PERFIL_ALUNO_ID,
      },
    });

    return this.toEntity(aluno);
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
