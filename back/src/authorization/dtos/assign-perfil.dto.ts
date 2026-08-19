import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignPerfilDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  perfil_id!: string;
}
