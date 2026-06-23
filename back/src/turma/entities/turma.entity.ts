import { ApiProperty } from '@nestjs/swagger';

export class TurmaEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  ativo!: boolean;

  @ApiProperty()
  horario_inicio!: Date;

  @ApiProperty()
  horario_fim!: Date;

  @ApiProperty({ nullable: true })
  data_especifica!: Date | null;

  @ApiProperty()
  segunda!: boolean;

  @ApiProperty()
  terca!: boolean;

  @ApiProperty()
  quarta!: boolean;

  @ApiProperty()
  quinta!: boolean;

  @ApiProperty()
  sexta!: boolean;

  @ApiProperty()
  sabado!: boolean;

  @ApiProperty()
  domingo!: boolean;
}
