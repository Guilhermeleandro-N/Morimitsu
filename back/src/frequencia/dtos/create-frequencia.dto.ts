import { Type } from 'class-transformer';
import { IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateFrequenciaDto {
  @IsString()
  @IsNotEmpty({ message: 'aluno_id é obrigatório' })
  aluno_id!: string;

  @IsString()
  @IsNotEmpty({ message: 'professor_id é obrigatório' })
  professor_id!: string;

  @IsString()
  @IsNotEmpty({ message: 'turma_id é obrigatório' })
  turma_id!: string;

  @Type(() => Date)
  @IsDate()
  data!: Date;

  @Type(() => Date)
  @IsDate()
  horario_inicio!: Date;

  @Type(() => Date)
  @IsDate()
  horario_fim!: Date;

  @IsString()
  @IsIn(['PRESENTE', 'AUSENTE'], { message: 'status_presenca deve ser PRESENTE ou AUSENTE' })
  status_presenca!: string;
}
