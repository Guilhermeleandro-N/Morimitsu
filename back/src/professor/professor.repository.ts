import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfessorDto } from './dtos/create-professor.dto.js';
import { UpdateProfessorDto } from './dtos/update-professor.dto.js';
import { ProfessorEntity } from './entities/professor.entity.js';

const PERFIL_PROFESSOR_ID = 'perfil-professor';

@Injectable()
export class ProfessorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async usuarioExiste(usuarioId: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId }, select: { id: true } });
    return !!usuario;
  }

  async professorJaExiste(usuarioId: string): Promise<boolean> {
    const professor = await this.prisma.professor.findUnique({ where: { usuarioId }, select: { id: true } });
    return !!professor;
  }

  async criar(dto: CreateProfessorDto): Promise<ProfessorEntity> {
    const professor = await this.prisma.professor.create({
      data: { faixa: dto.faixa ?? 'BRANCA', grau: dto.grau ?? 0, usuarioId: dto.usuarioId },
    });
    await this.prisma.userPerfil.upsert({
      where: { usuario_id_perfil_id: { usuario_id: dto.usuarioId, perfil_id: PERFIL_PROFESSOR_ID } },
      update: {},
      create: { usuario_id: dto.usuarioId, perfil_id: PERFIL_PROFESSOR_ID },
    });
    return this.toEntity(professor);
  }

  async listar(): Promise<ProfessorEntity[]> {
    const professores = await this.prisma.professor.findMany();
    return professores.map((p) => this.toEntity(p));
  }

  async buscarPorId(id: string): Promise<ProfessorEntity | null> {
    const professor = await this.prisma.professor.findUnique({ where: { id } });
    if (!professor) return null;
    return this.toEntity(professor);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<ProfessorEntity | null> {
    const professor = await this.prisma.professor.findUnique({ where: { usuarioId } });
    if (!professor) return null;
    return this.toEntity(professor);
  }

  async atualizar(id: string, dto: UpdateProfessorDto): Promise<ProfessorEntity | null> {
    const data: Record<string, unknown> = {};
    if (dto.faixa !== undefined) data.faixa = dto.faixa;
    if (dto.grau !== undefined) data.grau = dto.grau;
    const professor = await this.prisma.professor.update({ where: { id }, data });
    return this.toEntity(professor);
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.professor.delete({ where: { id } });
  }

  private toEntity(professor: { id: string; faixa: string; grau: number; usuarioId: string }): ProfessorEntity {
    const entity = new ProfessorEntity();
    entity.id = professor.id;
    entity.faixa = professor.faixa;
    entity.grau = professor.grau;
    entity.usuarioId = professor.usuarioId;
    return entity;
  }
}
