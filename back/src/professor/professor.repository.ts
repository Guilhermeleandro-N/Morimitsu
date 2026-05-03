import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfessorDto } from './dtos/create-professor.dto.js';
import { ProfessorEntity } from './entities/professor.entity.js';

const PERFIL_PROFESSOR_ID = 'perfil-professor';

@Injectable()
export class ProfessorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async usuarioExiste(usuarioId: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true },
    });
    return !!usuario;
  }

  async professorJaExiste(usuarioId: string): Promise<boolean> {
    const professor = await this.prisma.professor.findUnique({
      where: { usuarioId },
      select: { id: true },
    });
    return !!professor;
  }

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    const professor = await this.prisma.professor.create({
      data: {
        faixa: dto.faixa ?? 'BRANCA',
        grau: dto.grau ?? 0,
        usuarioId: dto.usuarioId,
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
      create: {
        usuario_id: dto.usuarioId,
        perfil_id: PERFIL_PROFESSOR_ID,
      },
    });

    return this.toEntity(professor);
  }

  private toEntity(professor: {
    id: string;
    faixa: string;
    grau: number;
    usuarioId: string;
  }): ProfessorEntity {
    const entity = new ProfessorEntity();
    entity.id = professor.id;
    entity.faixa = professor.faixa;
    entity.grau = professor.grau;
    entity.usuarioId = professor.usuarioId;
    return entity;
  }
}
