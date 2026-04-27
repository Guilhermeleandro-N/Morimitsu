import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

@Injectable()
export class AlunoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: CreateAlunoDto): Promise<AlunoEntity> {
    const emailPlaceholder = `aluno-${randomUUID()}@local.invalid`;

    const aluno = await this.prisma.aluno.create({
      data: {
        frequencia_atual: data.frequenciaAtual,
        faixa: data.faixa,
        grau_faixa: data.grau,
        usuario: {
          create: {
            nome: data.nome,
            telefone: data.telefone,
            email: emailPlaceholder,
            senha: 'NO_LOGIN',
            status: 'ENABLED',
          },
        },
      },
      include: { usuario: true },
    });

    return new AlunoEntity(
      aluno.id,
      aluno.usuario.nome,
      aluno.usuario.telefone ?? '',
      aluno.frequencia_atual,
      aluno.faixa,
      aluno.grau_faixa,
    );
  }

  async buscarPorId(id: string): Promise<AlunoEntity | null> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!aluno) {
      return null;
    }

    return new AlunoEntity(
      aluno.id,
      aluno.usuario.nome,
      aluno.usuario.telefone ?? '',
      aluno.frequencia_atual,
      aluno.faixa,
      aluno.grau_faixa,
    );
  }
}
