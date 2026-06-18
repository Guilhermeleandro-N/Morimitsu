import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { CreateFrequenciaProfDto } from './dtos/create-frequencia-prof.dto';
import { CreateFrequenciaDto } from './dtos/create-frequencia.dto';
import { UpdateFrequenciaProfDto } from './dtos/update-frequencia-prof.dto';
import { UpdateFrequenciaDto } from './dtos/update-frequencia.dto';
import { FrequenciaProfEntity } from './entities/frequencia-prof.entity';
import { FrequenciaEntity } from './entities/frequencia.entity';
import { FrequenciaService } from './frequencia.service';

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

  @Get('minhas-turmas')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  @ApiOperation({
    summary: 'Histórico de presenças de todas as turmas do professor logado',
  })
  @ApiResponse({ status: 200, type: [FrequenciaEntity] })
  async listarPorMinhasTurmas(
    @CurrentUser() usuario: JwtPayload,
    @Query('turma_id') turmaId?: string,
    @Query('aluno_id') alunoId?: string,
    @Query('data_inicio') dataInicio?: string,
    @Query('data_fim') dataFim?: string,
    @Query('frequente') frequente?: string,
  ): Promise<FrequenciaEntity[]> {
    return this.service.listarPorMinhasTurmas(usuario.sub, {
      turma_id: turmaId,
      aluno_id: alunoId,
      data_inicio: dataInicio ? new Date(dataInicio) : undefined,
      data_fim: dataFim ? new Date(dataFim) : undefined,
      frequente,
    });
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
