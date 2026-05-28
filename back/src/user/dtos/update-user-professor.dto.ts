import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+[\]{};:'",.<>/\\|`~])[A-Za-z\d@$!%*?&#^()\-_=+[\]{};:'",.<>/\\|`~]{8,}$/;

export class UpdateUserProfessorDto {
  @ApiPropertyOptional({ example: 'Maria Santos' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ example: 'maria@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @Matches(EMAIL_REGEX, { message: 'Email deve conter @ e um domínio válido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Senha@123' })
  @Matches(SENHA_REGEX, {
    message:
      'A senha deve ter no mínimo 8 caracteres, com pelo menos 1 maiúsculo, 1 minúsculo, 1 número e 1 caractere especial',
  })
  @IsOptional()
  senha?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({ example: 'MARROM' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau?: number;
}
