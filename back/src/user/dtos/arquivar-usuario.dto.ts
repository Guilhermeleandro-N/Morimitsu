import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ArquivarUsuarioDto {
  @ApiProperty({
    example: true,
    description: 'true para arquivar, false para reativar',
  })
  @IsBoolean()
  @IsNotEmpty({ message: 'arquivado é obrigatório' })
  arquivado!: boolean;
}
