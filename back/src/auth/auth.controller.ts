import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginRequestDto } from './dtos/login-request.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { LogoutRequestDto } from './dtos/logout-request.dto.js';
import { RefreshTokenRequestDto } from './dtos/refresh-token-request.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.service.login(dto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    return this.service.refreshToken(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Record<string, unknown>, @Body() dto: LogoutRequestDto): Promise<void> {
    const headers = (request['headers'] as Record<string, string>) ?? {};
    const authorization = headers.authorization ?? '';
    const [, accessToken = ''] = authorization.split(' ');
    await this.service.logout(accessToken, dto.refreshToken);
  }
}
