import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { TokenBlacklistService } from '../token-blacklist.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token não informado');
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    if (this.tokenBlacklistService.isRevoked(token)) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    try {
      const payload: Record<string, unknown> =
        await this.jwtService.verifyAsync(token);
      req['usuario'] = payload;
      next();
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
