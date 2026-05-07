import { IsNotEmpty, IsString } from 'class-validator';

export class AddAlunoTurmaDto {
  @IsString()
  @IsNotEmpty({ message: 'aluno_id é obrigatório' })
  aluno_id!: string;
}
