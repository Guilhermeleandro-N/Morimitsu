import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AlunoEntity } from '../aluno/entities/aluno.entity';
import { ProfessorEntity } from '../professor/entities/professor.entity';
import { AddAlunoTurmaDto } from './dtos/add-aluno-turma.dto';
import { AddProfessorTurmaDto } from './dtos/add-professor-turma.dto';
import { CreateTurmaDto } from './dtos/create-turma.dto';
import { UpdateAlunoTurmaDto } from './dtos/update-aluno-turma.dto';
import { UpdateTurmaStatusDto } from './dtos/update-turma-status.dto';
import { UpdateTurmaDto } from './dtos/update-turma.dto';
import { TurmaEntity } from './entities/turma.entity';
import { TurmaRepository } from './turma.repository';

const DIAS_PARA_EXCLUSAO = 30;
const MS_POR_DIA = 1000 * 60 * 60 * 24;
const INTERVALO_LIMPEZA_MS = 60 * 60 * 1000;

@Injectable()
export class TurmaService implements OnModuleInit, OnModuleDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly repository: TurmaRepository) {}

  onModuleInit(): void {
    this.timer = setInterval(
      () => void this.excluirArquivadasExpiradas(),
      INTERVALO_LIMPEZA_MS,
    );
    void this.excluirArquivadasExpiradas();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async excluirArquivadasExpiradas(): Promise<void> {
    try {
      const dataLimite = new Date(Date.now() - DIAS_PARA_EXCLUSAO * MS_POR_DIA);
      const removidas = await this.repository.deletarArquivadasApos(dataLimite);
      if (removidas > 0) {
        console.log(
          `${removidas} turma(s) arquivada(s) há mais de ${DIAS_PARA_EXCLUSAO} dias foram excluídas automaticamente.`,
        );
      }
    } catch (error) {
      console.error(
        'Erro ao excluir turmas arquivadas automaticamente:',
        error,
      );
    }
  }

  async criar(dto: CreateTurmaDto): Promise<TurmaEntity> {
    return this.repository.criar(dto);
  }

  async listar(
    skip: number,
    take: number,
  ): Promise<{ data: TurmaEntity[]; total: number }> {
    return this.repository.listar(skip, take);
  }

  async listarArquivadas(
    skip: number,
    take: number,
  ): Promise<{ data: TurmaEntity[]; total: number }> {
    return this.repository.listarArquivadas(skip, take);
  }

  async arquivar(id: string): Promise<TurmaEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Turma não encontrada');
    const arquivada = await this.repository.arquivar(id);
    if (!arquivada) throw new NotFoundException('Turma não encontrada');
    return arquivada;
  }

  async reativar(id: string): Promise<TurmaEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Turma não encontrada');
    const reativada = await this.repository.reativar(id);
    if (!reativada) throw new NotFoundException('Turma não encontrada');
    return reativada;
  }

  async buscarPorId(id: string): Promise<TurmaEntity> {
    const turma = await this.repository.buscarPorId(id);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return turma;
  }

  async atualizar(id: string, dto: UpdateTurmaDto): Promise<TurmaEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Turma não encontrada');
    const atualizada = await this.repository.atualizar(id, dto);
    if (!atualizada) throw new NotFoundException('Turma não encontrada');
    return atualizada;
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Turma não encontrada');
    await this.repository.deletar(id);
  }

  async atualizarStatus(
    id: string,
    dto: UpdateTurmaStatusDto,
  ): Promise<TurmaEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Turma não encontrada');
    const atualizada = await this.repository.atualizar(id, {
      status: dto.status,
    });
    if (!atualizada) throw new NotFoundException('Turma não encontrada');
    return atualizada;
  }

  async adicionarAluno(turmaId: string, dto: AddAlunoTurmaDto): Promise<void> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    await this.repository.adicionarAluno(turmaId, dto);
  }

  async atualizarAlunoNaTurma(
    turmaId: string,
    alunoId: string,
    dto: UpdateAlunoTurmaDto,
  ): Promise<void> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    await this.repository.atualizarAlunoNaTurma(turmaId, alunoId, dto);
  }

  async adicionarProfessor(
    turmaId: string,
    dto: AddProfessorTurmaDto,
  ): Promise<void> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    await this.repository.adicionarProfessor(turmaId, dto);
  }

  async listarAlunos(
    turmaId: string,
    skip: number,
    take: number,
  ): Promise<{ data: AlunoEntity[]; total: number }> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return this.repository.listarAlunosDaTurma(turmaId, skip, take);
  }

  async removerAlunoDaTurma(turmaId: string, alunoId: string): Promise<void> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    await this.repository.removerAlunoDaTurma(turmaId, alunoId);
  }

  async listarProfessores(
    turmaId: string,
    skip: number,
    take: number,
  ): Promise<{ data: ProfessorEntity[]; total: number }> {
    const turma = await this.repository.buscarPorId(turmaId);
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return this.repository.listarProfessoresDaTurma(turmaId, skip, take);
  }
}
