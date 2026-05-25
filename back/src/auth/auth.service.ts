import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AuthRepository } from './auth.repository.js';
import { LoginRequestDto } from './dtos/login-request.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { RefreshTokenRequestDto } from './dtos/refresh-token-request.dto.js';
import { AuthEntity } from './entities/auth.entity.js';
import { TokenBlacklistService } from './token-blacklist.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const auth = await this.repository.login(dto.email, dto.senha);

    if (!auth) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!auth.isEnabled()) {
      throw new UnauthorizedException('Usuário desativado');
    }

    return this.gerarTokens(auth);
  }

  async refreshToken(dto: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    if (this.tokenBlacklistService.isRevoked(dto.refreshToken)) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    let payload: { sub: string; email: string; roles: string[] };

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const auth = await this.repository.buscarPorId(payload.sub);

    if (!auth) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!auth.isEnabled()) {
      throw new UnauthorizedException('Usuário desativado');
    }

    return this.gerarTokens(auth);
  }

  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    if (accessToken) {
      this.revokeToken(accessToken);
    }

    if (refreshToken) {
      this.revokeToken(refreshToken);
    }
  }

  private async gerarTokens(auth: AuthEntity): Promise<LoginResponseDto> {
    const jwtPayload = { sub: auth.id, email: auth.email, roles: auth.roles };

    const accessExpiresIn = this.configService.get<string>(
      'JWT_EXPIRES_IN',
      '2h',
    ) as StringValue;
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '8h',
    ) as StringValue;
    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, { expiresIn: accessExpiresIn }),
      this.jwtService.signAsync(jwtPayload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      userId: auth.id,
      nome: auth.nome,
      email: auth.email,
      roles: auth.roles,
      token,
      refreshToken,
    };
  }

  private revokeToken(token: string): void {
    const payload = this.jwtService.decode(token);
    const expiresAtMs = payload?.exp ? payload.exp * 1000 : undefined;
    this.tokenBlacklistService.revoke(token, expiresAtMs);
  }
}
