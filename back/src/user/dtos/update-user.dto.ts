import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+[\]{};:'",.<>/\\|`~])[A-Za-z\d@$!%*?&#^()\-_=+[\]{};:'",.<>/\\|`~]{8,}$/;

export class UpdateUserDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @Matches(EMAIL_REGEX, { message: 'Email deve conter @ e um domínio válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Senha@123' })
  @Matches(SENHA_REGEX, { message: 'A senha deve ter no mínimo 8 caracteres, com pelo menos 1 maiúsculo, 1 minúsculo, 1 número e 1 caractere especial' })
  @IsOptional()
  senha?: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ example: 'ATIVO' })
  @IsString()
  @IsOptional()
  status?: string;
}
