import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+[\]{};:'",.<>/\\|`~])[A-Za-z\d@$!%*?&#^()\-_=+[\]{};:'",.<>/\\|`~]{8,}$/;

export class CreateUserProfessorDto {
  @ApiProperty({ example: 'Maria Santos' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @Matches(EMAIL_REGEX, { message: 'Email deve conter @ e um domínio válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'Senha@123' })
  @Matches(SENHA_REGEX, {
    message:
      'A senha deve ter no mínimo 8 caracteres, com pelo menos 1 maiúsculo, 1 minúsculo, 1 número e 1 caractere especial',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha!: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({ example: 'PRETA' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau?: number;
}
