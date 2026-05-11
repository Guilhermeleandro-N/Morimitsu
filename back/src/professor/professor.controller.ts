import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Criar professor' })
  @ApiResponse({ status: 201, type: ProfessorEntity })
  async criar(@Body() dto: CreateProfessorDto): Promise<ProfessorEntity> {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os professores' })
  @ApiResponse({ status: 200, type: [ProfessorEntity] })
  async listar(): Promise<ProfessorEntity[]> {
    return this.service.listar();
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Buscar professor por ID de usuário' })
  @ApiResponse({ status: 200, type: ProfessorEntity })
  async buscarPorUsuarioId(@Param('usuarioId') usuarioId: string): Promise<ProfessorEntity> {
    return this.service.buscarPorUsuarioId(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar professor por ID' })
  @ApiResponse({ status: 200, type: ProfessorEntity })
  async buscarPorId(@Param('id') id: string): Promise<ProfessorEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar professor' })
  @ApiResponse({ status: 200, type: ProfessorEntity })
  async atualizar(@Param('id') id: string, @Body() dto: UpdateProfessorDto): Promise<ProfessorEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar professor' })
  @ApiResponse({ status: 204 })
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
