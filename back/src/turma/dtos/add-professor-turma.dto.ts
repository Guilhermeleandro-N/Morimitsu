import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddProfessorTurmaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'professor_id é obrigatório' })
  professor_id!: string;
}
