import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateFrequenciaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'aluno_id é obrigatório' })
  aluno_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'professor_id é obrigatório' })
  professor_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'turma_id é obrigatório' })
  turma_id!: string;

  @ApiProperty({ example: '25/06/2024' })
  @Type(() => Date)
  @IsDate()
  data!: Date;

  @ApiProperty({ example: '07:00:00' })
  @Type(() => Date)
  @IsDate()
  horario_inicio!: Date;

  @ApiProperty({ example: '08:00:00' })
  @Type(() => Date)
  @IsDate()
  horario_fim!: Date;

  @ApiProperty({ enum: ['PRESENTE', 'AUSENTE'] })
  @IsString()
  @IsIn(['PRESENTE', 'AUSENTE'], {
    message: 'status_presenca deve ser PRESENTE ou AUSENTE',
  })
  status_presenca!: string;
}
