import { IsOptional, IsString } from 'class-validator';

export class LogoutRequestDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
