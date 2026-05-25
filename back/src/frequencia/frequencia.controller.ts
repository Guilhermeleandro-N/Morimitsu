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
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { Permissions } from '../authorization/decorators/permissions.decorator.js';
import { PermissionsGuard } from '../authorization/guards/permissions.guard.js';
import { CreateFrequenciaProfDto } from './dtos/create-frequencia-prof.dto.js';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto.js';
import { UpdateFrequenciaProfDto } from './dtos/update-frequencia-prof.dto.js';
import { UpdateFrequenciaDto } from './dtos/update-frequencia.dto.js';
import { FrequenciaProfEntity } from './entities/frequencia-prof.entity.js';
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
  @ApiOperation({
    summary:
      'Registrar frequência de aluno (incrementa frequencia_atual e gradua se atingir 30)',
  })
  @ApiResponse({ status: 201, type: FrequenciaEntity })
  async registrar(@Body() dto: CreateFrequenciaDto): Promise<FrequenciaEntity> {
    return this.service.registrar(dto);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.update')
  @ApiOperation({ summary: 'Editar frequência de aluno específico' })
  @ApiResponse({ status: 200, type: FrequenciaEntity })
  async atualizar(
    @Param('id') id: string,
    @Body() dto: UpdateFrequenciaDto,
  ): Promise<FrequenciaEntity> {
    return this.service.atualizar(id, dto);
  }

  @Get('aluno/:alunoId')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  @ApiOperation({
    summary:
      'Histórico de presenças de um aluno (ativos e inativos com vínculo ao professor)',
  })
  @ApiResponse({ status: 200, type: [FrequenciaEntity] })
  async listarPorAluno(
    @Param('alunoId') alunoId: string,
    @CurrentUser() usuario: JwtPayload,
  ): Promise<FrequenciaEntity[]> {
    const professorUsuarioId = usuario.roles?.includes('admin')
      ? undefined
      : usuario.sub;
    return this.service.listarPorAluno(alunoId, professorUsuarioId);
  }

  @Get('turma/:turmaId')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  @ApiOperation({ summary: 'Listar frequências por turma' })
  @ApiResponse({ status: 200, type: [FrequenciaEntity] })
  async listarPorTurma(
    @Param('turmaId') turmaId: string,
  ): Promise<FrequenciaEntity[]> {
    return this.service.listarPorTurma(turmaId);
  }

  // FrequenciaProf (Treinos)
  @Post('treino')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('training.create')
  @ApiOperation({ summary: 'Registrar sessão de treino do professor' })
  @ApiResponse({ status: 201, type: FrequenciaProfEntity })
  async registrarTreino(
    @Body() dto: CreateFrequenciaProfDto,
  ): Promise<FrequenciaProfEntity> {
    return this.service.registrarTreino(dto);
  }

  @Patch('treino/:id')
  @UseGuards(PermissionsGuard)
  @Permissions('training.update')
  @ApiOperation({ summary: 'Editar sessão de treino do professor' })
  @ApiResponse({ status: 200, type: FrequenciaProfEntity })
  async atualizarTreino(
    @Param('id') id: string,
    @Body() dto: UpdateFrequenciaProfDto,
  ): Promise<FrequenciaProfEntity> {
    return this.service.atualizarTreino(id, dto);
  }

  @Get('treino/professor/:professorId')
  @UseGuards(PermissionsGuard)
  @Permissions('training.read')
  @ApiOperation({ summary: 'Listar treinos de um professor' })
  @ApiResponse({ status: 200, type: [FrequenciaProfEntity] })
  async listarTreinosPorProfessor(
    @Param('professorId') professorId: string,
  ): Promise<FrequenciaProfEntity[]> {
    return this.service.listarTreinosPorProfessor(professorId);
  }
}
