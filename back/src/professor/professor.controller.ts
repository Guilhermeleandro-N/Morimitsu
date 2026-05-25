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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../authorization/decorators/permissions.decorator.js';
import { PermissionsGuard } from '../authorization/guards/permissions.guard.js';
import { CreateProfessorDto } from './dtos/create-professor.dto.js';
import { UpdateProfessorDto } from './dtos/update-professor.dto.js';
import { ProfessorEntity } from './entities/professor.entity.js';
import { ProfessorService } from './professor.service.js';

@ApiTags('Professor')
@ApiBearerAuth()
@Controller('professor')
export class ProfessorController {
  constructor(private readonly service: ProfessorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('professor.create')
  @ApiOperation({ summary: 'Criar professor (somente admin)' })
  @ApiResponse({ status: 201, type: ProfessorEntity })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async criar(@Body() dto: CreateProfessorDto): Promise<ProfessorEntity> {
    return this.service.criar(dto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('professor.read')
  @ApiOperation({ summary: 'Listar todos os professores' })
  @ApiResponse({ status: 200, type: [ProfessorEntity] })
  async listar(): Promise<ProfessorEntity[]> {
    return this.service.listar();
  }

  @Get('usuario/:usuarioId')
  @UseGuards(PermissionsGuard)
  @Permissions('professor.read')
  @ApiOperation({ summary: 'Buscar professor por ID de usuário' })
  @ApiResponse({ status: 200, type: ProfessorEntity })
  async buscarPorUsuarioId(
    @Param('usuarioId') usuarioId: string,
  ): Promise<ProfessorEntity> {
    return this.service.buscarPorUsuarioId(usuarioId);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('professor.read')
  @ApiOperation({ summary: 'Buscar professor por ID' })
  @ApiResponse({ status: 200, type: ProfessorEntity })
  async buscarPorId(@Param('id') id: string): Promise<ProfessorEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('professor.update')
  @ApiOperation({ summary: 'Atualizar professor (somente admin)' })
  @ApiResponse({ status: 200, type: ProfessorEntity })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async atualizar(
    @Param('id') id: string,
    @Body() dto: UpdateProfessorDto,
  ): Promise<ProfessorEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('professor.update')
  @ApiOperation({ summary: 'Deletar professor (somente admin)' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
