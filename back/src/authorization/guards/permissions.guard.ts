import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const usuario = request['usuario'] as
      | { sub: string; roles?: string[] }
      | undefined;

    if (!usuario?.sub) {
      throw new ForbiddenException('Acesso negado');
    }

    if (usuario.roles?.includes('admin')) {
      return true;
    }

    const userPermissions = await this.authorizationService.getUserPermissions(
      usuario.sub,
    );

    const hasAll = required.every((perm) => userPermissions.includes(perm));

    if (!hasAll) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    return true;
  }
}
