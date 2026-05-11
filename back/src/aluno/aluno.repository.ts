import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { UpdateAlunoDto } from './dtos/update-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

const PERFIL_ALUNO_ID = 'perfil-aluno';

@Injectable()
export class AlunoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async usuarioExiste(usuarioId: string): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId }, select: { id: true } });
    return !!usuario;
  }

  async alunoJaExiste(usuarioId: string): Promise<boolean> {
    const aluno = await this.prisma.aluno.findUnique({ where: { usuarioId }, select: { id: true } });
    return !!aluno;
  }

  async criar(dto: CreateAlunoDto): Promise<AlunoEntity> {
    const aluno = await this.prisma.aluno.create({
      data: { faixa: dto.faixa ?? 'BRANCA', grau_faixa: dto.grau_faixa ?? 0, usuarioId: dto.usuarioId },
    });
    await this.prisma.userPerfil.upsert({
      where: { usuario_id_perfil_id: { usuario_id: dto.usuarioId, perfil_id: PERFIL_ALUNO_ID } },
      update: {},
      create: { usuario_id: dto.usuarioId, perfil_id: PERFIL_ALUNO_ID },
    });
    return this.toEntity(aluno);
  }

  async listar(): Promise<AlunoEntity[]> {
    const alunos = await this.prisma.aluno.findMany();
    return alunos.map((a) => this.toEntity(a));
  }

  async buscarPorId(id: string): Promise<AlunoEntity | null> {
    const aluno = await this.prisma.aluno.findUnique({ where: { id } });
    if (!aluno) return null;
    return this.toEntity(aluno);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<AlunoEntity | null> {
    const aluno = await this.prisma.aluno.findUnique({ where: { usuarioId } });
    if (!aluno) return null;
    return this.toEntity(aluno);
  }

  async atualizar(id: string, dto: UpdateAlunoDto): Promise<AlunoEntity | null> {
    const data: Record<string, unknown> = {};
    if (dto.faixa !== undefined) data.faixa = dto.faixa;
    if (dto.grau_faixa !== undefined) data.grau_faixa = dto.grau_faixa;
    if (dto.frequencia_atual !== undefined) data.frequencia_atual = dto.frequencia_atual;

    const aluno = await this.prisma.aluno.update({ where: { id }, data });
    return this.toEntity(aluno);
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.aluno.delete({ where: { id } });
  }

  private toEntity(aluno: { id: string; frequencia_atual: number; grau_faixa: number; faixa: string; usuarioId: string }): AlunoEntity {
    const entity = new AlunoEntity();
    entity.id = aluno.id;
    entity.frequencia_atual = aluno.frequencia_atual;
    entity.grau_faixa = aluno.grau_faixa;
    entity.faixa = aluno.faixa;
    entity.usuarioId = aluno.usuarioId;
    return entity;
  }
}
