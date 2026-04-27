import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUsuarioDto } from './dtos/create-usuario.dto.js';
import { LoginRequestDto } from './dtos/login-request.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { RefreshTokenRequestDto } from './dtos/refresh-token-request.dto.js';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto.js';
import { UsuarioResponseDto } from './dtos/usuario-response.dto.js';

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
  async refreshToken(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<LoginResponseDto> {
    return this.service.refreshToken(dto);
  }

  @Post('usuarios')
  @HttpCode(HttpStatus.CREATED)
  async criarUsuario(
    @Body() dto: CreateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    return this.service.criarUsuario(dto);
  }

  @Get('usuarios')
  async listarUsuarios(): Promise<UsuarioResponseDto[]> {
    return this.service.listarUsuarios();
  }

  @Get('usuarios/:id')
  async buscarPorId(@Param('id') id: string): Promise<UsuarioResponseDto> {
    return this.service.buscarPorId(id);
  }

  @Patch('usuarios/:id')
  async atualizarUsuario(
    @Param('id') id: string,
    @Body() dto: UpdateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    return this.service.atualizarUsuario(id, dto);
  }

  @Delete('usuarios/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarUsuario(@Param('id') id: string): Promise<void> {
    return this.service.deletarUsuario(id);
  }
}
