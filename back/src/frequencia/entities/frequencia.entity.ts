import { ApiProperty } from '@nestjs/swagger';

export class FrequenciaEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  aluno_id!: string;

  @ApiProperty()
  professor_id!: string;

  @ApiProperty()
  turma_id!: string;

  @ApiProperty()
  data!: Date;

  @ApiProperty()
  horario_inicio!: Date;

  @ApiProperty()
  horario_fim!: Date;

  @ApiProperty({ enum: ['PRESENTE', 'AUSENTE'] })
  status_presenca!: string;
}
