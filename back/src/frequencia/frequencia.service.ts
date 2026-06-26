import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateFrequenciaProfDto } from './dtos/create-frequencia-prof.dto';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto';
import { RelatorioTreinoDto } from './dtos/relatorio-treino.dto';
import { UpdateFrequenciaProfDto } from './dtos/update-frequencia-prof.dto';
import { UpdateFrequenciaDto } from './dtos/update-frequencia.dto';
import { FrequenciaProfEntity } from './entities/frequencia-prof.entity';
import { FrequenciaEntity } from './entities/frequencia.entity';
import { FrequenciaRepository } from './frequencia.repository';

@Injectable()
export class FrequenciaService {
  constructor(private readonly repository: FrequenciaRepository) {}

  async registrar(dto: CreateFrequenciaDto): Promise<FrequenciaEntity> {
    const professorNaTurma = await this.repository.professorExisteNaTurma(
      dto.professor_id,
      dto.turma_id,
    );
    if (!professorNaTurma) {
      throw new ForbiddenException('Professor não está vinculado a esta turma');
    }

    const alunoNaTurma = await this.repository.alunoExisteNaTurma(
      dto.aluno_id,
      dto.turma_id,
    );
    if (!alunoNaTurma) {
      throw new BadRequestException('Aluno não está vinculado a esta turma');
    }

    const resultado = await this.repository.registrar(dto);
    return resultado.frequencia;
  }

  async atualizar(
    id: string,
    dto: UpdateFrequenciaDto,
  ): Promise<FrequenciaEntity> {
    return this.repository.atualizar(id, dto);
  }

  async listarPorAluno(
    alunoId: string,
    professorUsuarioId?: string,
  ): Promise<FrequenciaEntity[]> {
    if (professorUsuarioId) {
      const temVinculo = await this.repository.alunoTemVinculoComProfessor(
        alunoId,
        professorUsuarioId,
      );
      if (!temVinculo) {
        throw new ForbiddenException('Você não possui vínculo com este aluno');
      }
    }
    return this.repository.listarPorAluno(alunoId);
  }

  async listarPorTurma(turmaId: string): Promise<FrequenciaEntity[]> {
    return this.repository.listarPorTurma(turmaId);
  }

  async listarPorMinhasTurmas(
    professorUsuarioId: string,
    filtros?: {
      turma_id?: string;
      aluno_id?: string;
      data_inicio?: Date;
      data_fim?: Date;
      frequente?: string;
    },
  ): Promise<FrequenciaEntity[]> {
    return this.repository.listarPorMinhasTurmas(professorUsuarioId, filtros);
  }

  async registrarTreino(
    dto: CreateFrequenciaProfDto,
  ): Promise<FrequenciaProfEntity> {
    const professorNaTurma = await this.repository.professorExisteNaTurma(
      dto.professor_id,
      dto.turma_id,
    );
    if (!professorNaTurma) {
      throw new ForbiddenException('Professor não está vinculado a esta turma');
    }
    return this.repository.registrarTreino(dto);
  }

  async relatorioTreino(
    usuarioId: string,
    dto: RelatorioTreinoDto,
  ): Promise<{
    treino: FrequenciaProfEntity;
    frequencias: FrequenciaEntity[];
  }> {
    const professor = await this.repository.buscarProfessorPorUsuarioId(
      usuarioId,
    );
    if (!professor) {
      throw new ForbiddenException('Usuário não é professor');
    }

    const professorNaTurma = await this.repository.professorExisteNaTurma(
      professor.id,
      dto.turma_id,
    );
    if (!professorNaTurma) {
      throw new ForbiddenException('Professor não está vinculado a esta turma');
    }

    const alunosNaTurma = await Promise.all(
      dto.alunos_presentes.map((alunoId) =>
        this.repository.alunoExisteNaTurma(alunoId, dto.turma_id),
      ),
    );

    const temAlunoInvalido = alunosNaTurma.some((v) => !v);
    if (temAlunoInvalido) {
      throw new BadRequestException(
        'Um ou mais alunos não estão vinculados a esta turma',
      );
    }

    return this.repository.relatorioTreino(
      professor.id,
      dto.turma_id,
      dto.alunos_presentes,
    );
  }

  async atualizarTreino(
    id: string,
    dto: UpdateFrequenciaProfDto,
  ): Promise<FrequenciaProfEntity> {
    return this.repository.atualizarTreino(id, dto);
  }

  async listarTreinosPorProfessor(
    professorId: string,
  ): Promise<FrequenciaProfEntity[]> {
    return this.repository.listarTreinosPorProfessor(professorId);
  }
}
