import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

/**
 * Extrai o payload do usuário autenticado a partir do request.
 * Requer que o JwtAuthMiddleware ou JwtAuthGuard tenha sido aplicado na rota.
 *
 * @example
 * async minhaRota(@CurrentUser() usuario: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request['usuario'] as JwtPayload;
  },
);
