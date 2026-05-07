import { IsNotEmpty, IsString } from 'class-validator';

export class AddProfessorTurmaDto {
  @IsString()
  @IsNotEmpty({ message: 'professor_id é obrigatório' })
  professor_id!: string;
}
