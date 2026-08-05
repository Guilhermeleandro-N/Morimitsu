import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from './decorators/permissions.decorator';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthorizationService } from './authorization.service';
import { AuthorizationRepository } from './authorization.repository';
import { AssignPerfilDto } from './dtos/assign-perfil.dto';
import { DefinirPermissaoDto } from './dtos/definir-permissao.dto';

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller('authorization')
@UseGuards(PermissionsGuard)
export class AuthorizationController {
  constructor(
    private readonly authService: AuthorizationService,
    private readonly repository: AuthorizationRepository,
  ) {}

  @Get('perfis')
  @Permissions('user.read')
  @ApiOperation({ summary: 'Listar todos os perfis' })
  async listarPerfis() {
    return this.repository.listarPerfis();
  }

  @Get('permissoes')
  @Permissions('user.read')
  @ApiOperation({ summary: 'Listar todas as permissões' })
  async listarPermissoes() {
    return this.repository.listarPermissoes();
  }

  @Get('user/:userId/permissoes')
  @Permissions('user.read')
  @ApiOperation({ summary: 'Listar permissões efetivas de um usuário' })
  async listarPermissoesDoUsuario(@Param('userId') userId: string) {
    return this.repository.listarPermissoesDoUsuario(userId);
  }

  @Get('perfis/:perfilId/permissoes')
  @Permissions('user.read')
  @ApiOperation({ summary: 'Listar permissões de um perfil' })
  async listarPermissoesDoPerfil(@Param('perfilId') perfilId: string) {
    return this.repository.listarPermissoesDoPerfil(perfilId);
  }

  @Get('user/:userId/perfis')
  @Permissions('user.read')
  @ApiOperation({ summary: 'Listar perfis de um usuário' })
  async listarPerfisDoUsuario(@Param('userId') userId: string) {
    return this.repository.listarPerfisDoUsuario(userId);
  }

  @Post('user/:userId/perfil')
  @HttpCode(HttpStatus.CREATED)
  @Permissions('user.update')
  @ApiOperation({ summary: 'Atribuir perfil a um usuário' })
  @ApiResponse({ status: 201 })
  async atribuirPerfil(
    @Param('userId') userId: string,
    @Body() dto: AssignPerfilDto,
  ) {
    return this.repository.atribuirPerfil(userId, dto.perfil_id);
  }

  @Delete('user/:userId/perfil/:perfilId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('user.update')
  @ApiOperation({ summary: 'Remover perfil de um usuário' })
  @ApiResponse({ status: 204 })
  async removerPerfil(
    @Param('userId') userId: string,
    @Param('perfilId') perfilId: string,
  ) {
    return this.repository.removerPerfil(userId, perfilId);
  }

  @Post('user/:userId/permissao')
  @HttpCode(HttpStatus.CREATED)
  @Permissions('user.update')
  @ApiOperation({ summary: 'Conceder ou revogar uma permissão a um usuário' })
  @ApiResponse({ status: 201 })
  async definirPermissao(
    @Param('userId') userId: string,
    @Body() dto: DefinirPermissaoDto,
  ) {
    return this.repository.definirPermissaoDoUsuario(
      userId,
      dto.permission_id,
      dto.ativa,
    );
  }
}
