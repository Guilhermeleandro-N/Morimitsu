import { ApiProperty } from '@nestjs/swagger';

export class FrequenciaHistoricoItem {
  @ApiProperty()
  data!: Date;

  @ApiProperty({ enum: ['PRESENTE', 'AUSENTE'] })
  status_presenca!: string;

  @ApiProperty()
  turma_nome!: string;
}
