import { ApiProperty } from '@nestjs/swagger';
import { AlunoEntity } from '../../aluno/entities/aluno.entity';

export class PainelTurmaItem {
  @ApiProperty()
  turma_id!: string;

  @ApiProperty()
  turma_nome!: string;

  @ApiProperty({ type: [AlunoEntity] })
  proximos_graduacao!: AlunoEntity[];

  @ApiProperty({ type: [AlunoEntity] })
  aniversariantes!: AlunoEntity[];

  @ApiProperty()
  total_alunos_ativos!: number;
}

export class PainelProfessorResponse {
  @ApiProperty({ type: [PainelTurmaItem] })
  turmas!: PainelTurmaItem[];
}
