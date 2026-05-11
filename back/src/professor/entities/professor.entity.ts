import { ApiProperty } from '@nestjs/swagger';

export class ProfessorEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  faixa!: string;

  @ApiProperty()
  grau!: number;

  @ApiProperty()
  usuarioId!: string;
}
