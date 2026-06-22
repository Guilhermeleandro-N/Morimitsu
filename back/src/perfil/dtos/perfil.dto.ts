import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class BulkTogglePermissoesDto {
  @ApiPropertyOptional({
    description: 'Códigos de permissão a adicionar',
    example: ['turma.create'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adicionar?: string[];

  @ApiPropertyOptional({
    description: 'Códigos de permissão a remover',
    example: ['notification.read'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remover?: string[];
}

export class AtribuirPerfilDto {
  @ApiProperty({ description: 'ID do perfil', example: 'perfil-professor' })
  @IsString()
  @IsNotEmpty()
  perfil_id!: string;

  @ApiProperty({
    enum: ['adicionar', 'remover'],
    description: 'Ação a executar',
  })
  @IsString()
  @IsIn(['adicionar', 'remover'])
  acao!: 'adicionar' | 'remover';
}
