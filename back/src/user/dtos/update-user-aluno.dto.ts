import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
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

export class UpdateUserAlunoDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
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

  @ApiPropertyOptional({ example: '2000-01-01' })
  @IsDateString()
  @IsOptional()
  data_nascimento?: string;

  @ApiPropertyOptional({ example: 'AZUL' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau_faixa?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Min(0)
  @IsOptional()
  frequencia_atual?: number;
}
