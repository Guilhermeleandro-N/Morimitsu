import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateProfessorDto } from './dtos/create-professor.dto.js';
import { UpdateProfessorDto } from './dtos/update-professor.dto.js';
import { ProfessorEntity } from './entities/professor.entity.js';
import { ProfessorService } from './professor.service.js';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly service: ProfessorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CreateProfessorDto): Promise<ProfessorEntity> {
    return this.service.criar(dto);
  }

  @Get()
  async listar(): Promise<ProfessorEntity[]> {
    return this.service.listar();
  }

  @Get('usuario/:usuarioId')
  async buscarPorUsuarioId(@Param('usuarioId') usuarioId: string): Promise<ProfessorEntity> {
    return this.service.buscarPorUsuarioId(usuarioId);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string): Promise<ProfessorEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  async atualizar(@Param('id') id: string, @Body() dto: UpdateProfessorDto): Promise<ProfessorEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
