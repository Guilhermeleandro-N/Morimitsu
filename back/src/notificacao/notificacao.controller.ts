import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../authorization/decorators/permissions.decorator';
import { PermissionsGuard } from '../authorization/guards/permissions.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { NotificacaoCountEntity } from './entities/notificacao-count.entity';
import { NotificacaoEntity } from './entities/notificacao.entity';
import { NotificacaoService } from './notificacao.service';

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
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<NotificacaoEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    return this.service.listarPorProfessor(
      usuario.sub,
      (page - 1) * limit,
      limit,
    );
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
