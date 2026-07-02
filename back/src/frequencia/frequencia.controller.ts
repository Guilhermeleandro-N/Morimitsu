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
import { RelatorioTreinoDto } from './dtos/relatorio-treino.dto';
import { UpdateFrequenciaProfDto } from './dtos/update-frequencia-prof.dto';
import { UpdateFrequenciaDto } from './dtos/update-frequencia.dto';
import { FrequenciaProfEntity } from './entities/frequencia-prof.entity';
import { FrequenciaEntity } from './entities/frequencia.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
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
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<FrequenciaEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const professorUsuarioId = usuario.roles?.includes('admin')
      ? undefined
      : usuario.sub;
    const { data, total } = await this.service.listarPorAluno(
      alunoId,
      professorUsuarioId,
      (page - 1) * limit,
      limit,
    );
    return new PaginatedResult(data, total, page, limit);
  }

  @Get('turma/:turmaId')
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.read')
  @ApiOperation({ summary: 'Listar frequências por turma' })
  @ApiResponse({ status: 200, type: [FrequenciaEntity] })
  async listarPorTurma(
    @Param('turmaId') turmaId: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<FrequenciaEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const { data, total } = await this.service.listarPorTurma(
      turmaId,
      (page - 1) * limit,
      limit,
    );
    return new PaginatedResult(data, total, page, limit);
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
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResult<FrequenciaEntity>> {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;
    const { data, total } = await this.service.listarPorMinhasTurmas(
      usuario.sub,
      {
        turma_id: turmaId,
        aluno_id: alunoId,
        data_inicio: dataInicio ? new Date(dataInicio) : undefined,
        data_fim: dataFim ? new Date(dataFim) : undefined,
        frequente,
      },
      (p - 1) * l,
      l,
    );
    return new PaginatedResult(data, total, p, l);
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
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<FrequenciaProfEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const { data, total } = await this.service.listarTreinosPorProfessor(
      professorId,
      (page - 1) * limit,
      limit,
    );
    return new PaginatedResult(data, total, page, limit);
  }

  @Post('turma/relatorio')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('attendance.create')
  @ApiOperation({
    summary:
      'Fechar treino: registra o treino do professor e a frequência de todos os alunos de uma vez',
  })
  @ApiResponse({ status: 201, description: 'Treino fechado com sucesso' })
  async relatorioTreino(
    @CurrentUser() usuario: JwtPayload,
    @Body() dto: RelatorioTreinoDto,
  ) {
    return this.service.relatorioTreino(usuario.sub, dto);
  }
}
