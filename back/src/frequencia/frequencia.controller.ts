import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../authorization/decorators/permissions.decorator.js';
import { PermissionsGuard } from '../authorization/guards/permissions.guard.js';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto.js';
import { FrequenciaEntity } from './entities/frequencia.entity.js';
import { FrequenciaService } from './frequencia.service.js';

@ApiTags('Frequência')
@ApiBearerAuth()
@Controller('frequencia')
export class FrequenciaController {
  constructor(private readonly service: FrequenciaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.create')
  @ApiOperation({ summary: 'Registrar frequência' })
  @ApiResponse({ status: 201, type: FrequenciaEntity })
  async registrar(@Body() dto: CreateFrequenciaDto): Promise<FrequenciaEntity> {
    return this.service.registrar(dto);
  }

  @Get('aluno/:alunoId')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  @ApiOperation({ summary: 'Listar frequências por aluno' })
  @ApiResponse({ status: 200, type: [FrequenciaEntity] })
  async listarPorAluno(@Param('alunoId') alunoId: string): Promise<FrequenciaEntity[]> {
    return this.service.listarPorAluno(alunoId);
  }

  @Get('turma/:turmaId')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  @ApiOperation({ summary: 'Listar frequências por turma' })
  @ApiResponse({ status: 200, type: [FrequenciaEntity] })
  async listarPorTurma(@Param('turmaId') turmaId: string): Promise<FrequenciaEntity[]> {
    return this.service.listarPorTurma(turmaId);
  }
}
