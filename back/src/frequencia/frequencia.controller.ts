import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { Permissions } from '../authorization/decorators/permissions.decorator.js';
import { PermissionsGuard } from '../authorization/guards/permissions.guard.js';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto.js';
import { FrequenciaEntity } from './entities/frequencia.entity.js';
import { FrequenciaService } from './frequencia.service.js';

@Controller('frequencia')
export class FrequenciaController {
  constructor(private readonly service: FrequenciaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.create')
  async registrar(@Body() dto: CreateFrequenciaDto): Promise<FrequenciaEntity> {
    return this.service.registrar(dto);
  }

  @Get('aluno/:alunoId')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  async listarPorAluno(@Param('alunoId') alunoId: string): Promise<FrequenciaEntity[]> {
    return this.service.listarPorAluno(alunoId);
  }

  @Get('turma/:turmaId')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  async listarPorTurma(@Param('turmaId') turmaId: string): Promise<FrequenciaEntity[]> {
    return this.service.listarPorTurma(turmaId);
  }
}
