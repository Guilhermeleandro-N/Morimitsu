import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class DefinirPermissaoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permission_id!: string;

  @ApiProperty()
  @IsBoolean()
  ativa!: boolean;
}
