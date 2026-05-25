import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FrequenciaProfEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  professor_id!: string;

  @ApiProperty()
  turma_id!: string;

  @ApiProperty()
  data!: Date;

  @ApiProperty({ enum: ['REALIZADA', 'CANCELADA', 'REMARCADA'] })
  status_aula!: string;

  @ApiPropertyOptional()
  data_remarcacao!: Date | null;
}
