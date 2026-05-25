import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { Permissions } from '../authorization/decorators/permissions.decorator.js';
import { PermissionsGuard } from '../authorization/guards/permissions.guard.js';
import { NotificacaoCountEntity } from './entities/notificacao-count.entity.js';
import { NotificacaoEntity } from './entities/notificacao.entity.js';
import { NotificacaoService } from './notificacao.service.js';

@ApiTags('Notificação')
@ApiBearerAuth()
@Controller('notificacao')
export class NotificacaoController {
  constructor(private readonly service: NotificacaoService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('notification.read')
  @ApiOperation({ summary: 'Listar notificações do professor logado' })
  @ApiResponse({ status: 200, type: [NotificacaoEntity] })
  async listar(
    @CurrentUser() usuario: JwtPayload,
  ): Promise<NotificacaoEntity[]> {
    return this.service.listarPorProfessor(usuario.sub);
  }

  @Get('nao-lidas/count')
  @UseGuards(PermissionsGuard)
  @Permissions('notification.read')
  @ApiOperation({
    summary: 'Contar notificações não lidas do professor logado',
  })
  @ApiResponse({ status: 200, type: NotificacaoCountEntity })
  async contarNaoLidas(
    @CurrentUser() usuario: JwtPayload,
  ): Promise<NotificacaoCountEntity> {
    return this.service.contarNaoLidas(usuario.sub);
  }

  @Patch(':id/lida')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('notification.read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiResponse({ status: 200, type: NotificacaoEntity })
  async marcarComoLida(
    @Param('id') id: string,
    @CurrentUser() usuario: JwtPayload,
  ): Promise<NotificacaoEntity> {
    return this.service.marcarComoLida(id, usuario.sub);
  }
}
