import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../authorization/decorators/permissions.decorator';
import { PermissionsGuard } from '../authorization/guards/permissions.guard';
import { AtribuirPerfilDto, BulkTogglePermissoesDto } from './dtos/perfil.dto';
import {
  CatalogoPermissoesEntity,
  PerfilCompletoEntity,
  PerfilResumoEntity,
  UsuarioPerfilEntity,
} from './entities/perfil.entity';
import { PerfilService } from './perfil.service';

@ApiTags('Perfil')
@ApiBearerAuth()
@Controller('perfil')
export class PerfilController {
  constructor(private readonly service: PerfilService) {}

  @Get('permissoes')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Catálogo de permissões agrupado por módulo' })
  @ApiResponse({ status: 200, type: CatalogoPermissoesEntity })
  async listarPermissoes(): Promise<CatalogoPermissoesEntity> {
    return this.service.listarPermissoesAgrupadas();
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Listar todos os perfis' })
  @ApiResponse({ status: 200, type: [PerfilResumoEntity] })
  async listarPerfis(): Promise<PerfilResumoEntity[]> {
    return this.service.listarPerfis();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Buscar perfil com permissões agrupadas' })
  @ApiResponse({ status: 200, type: PerfilCompletoEntity })
  async buscarPerfil(@Param('id') id: string): Promise<PerfilCompletoEntity> {
    return this.service.buscarPerfil(id);
  }

  @Patch(':id/permissoes')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.update')
  @ApiOperation({
    summary: 'Adicionar/remover permissões de um perfil (bulk toggle)',
  })
  @ApiResponse({ status: 200, type: PerfilCompletoEntity })
  async togglePermissoes(
    @Param('id') id: string,
    @Body() dto: BulkTogglePermissoesDto,
  ): Promise<PerfilCompletoEntity> {
    return this.service.togglePermissoes(id, dto);
  }

  @Get('usuario/:usuarioId')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Listar perfis atribuídos ao usuário' })
  @ApiResponse({ status: 200, type: [UsuarioPerfilEntity] })
  async listarPerfisUsuario(
    @Param('usuarioId') usuarioId: string,
  ): Promise<UsuarioPerfilEntity[]> {
    return this.service.listarPerfisUsuario(usuarioId);
  }

  @Post('usuario/:usuarioId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('turma.update')
  @ApiOperation({
    summary: 'Atribuir ou remover perfil do usuário (promoção Aluno↔Professor)',
  })
  @ApiResponse({ status: 200 })
  async atribuirPerfil(
    @Param('usuarioId') usuarioId: string,
    @Body() dto: AtribuirPerfilDto,
  ): Promise<{ mensagem: string }> {
    return this.service.atribuirPerfil(usuarioId, dto);
  }
}
