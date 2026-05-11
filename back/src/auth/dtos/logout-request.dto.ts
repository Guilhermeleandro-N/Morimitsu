import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
