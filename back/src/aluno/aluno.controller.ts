import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Permissions } from '../authorization/decorators/permissions.decorator.js';
import { PermissionsGuard } from '../authorization/guards/permissions.guard.js';
import { AlunoService } from './aluno.service.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { UpdateAlunoDto } from './dtos/update-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly service: AlunoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('student.create')
  async criar(@Body() dto: CreateAlunoDto): Promise<AlunoEntity> {
    return this.service.criar(dto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('student.read')
  async listar(): Promise<AlunoEntity[]> {
    return this.service.listar();
  }

  @Get('usuario/:usuarioId')
  @UseGuards(PermissionsGuard)
  @Permissions('student.read')
  async buscarPorUsuarioId(@Param('usuarioId') usuarioId: string): Promise<AlunoEntity> {
    return this.service.buscarPorUsuarioId(usuarioId);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('student.read')
  async buscarPorId(@Param('id') id: string): Promise<AlunoEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('student.update')
  async atualizar(@Param('id') id: string, @Body() dto: UpdateAlunoDto): Promise<AlunoEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('student.update')
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
