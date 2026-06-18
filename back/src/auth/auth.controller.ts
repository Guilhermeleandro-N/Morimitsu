import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LogoutRequestDto } from './dtos/logout-request.dto';
import { RefreshTokenRequestDto } from './dtos/refresh-token-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.service.login(dto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async refreshToken(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<LoginResponseDto> {
    return this.service.refreshToken(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encerrar sessão do usuário' })
  @ApiResponse({ status: 204 })
  async logout(
    @Req() request: Record<string, unknown>,
    @Body() dto: LogoutRequestDto,
  ): Promise<void> {
    const headers = (request['headers'] as Record<string, string>) ?? {};
    const authorization = headers.authorization ?? '';
    const [, accessToken = ''] = authorization.split(' ');
    await this.service.logout(accessToken, dto.refreshToken);
  }
}
