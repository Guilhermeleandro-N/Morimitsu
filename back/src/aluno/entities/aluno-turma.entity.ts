import { ApiProperty } from '@nestjs/swagger';
import { TurmaEntity } from '../../turma/entities/turma.entity';

export class AlunoTurmaEntity extends TurmaEntity {
  @ApiProperty({ description: 'Status do vínculo do aluno na turma (S/N)' })
  frequente!: string;
}
