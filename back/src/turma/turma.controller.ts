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
  Query,
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
import { AlunoEntity } from '../aluno/entities/aluno.entity';
import { ProfessorEntity } from '../professor/entities/professor.entity';
import { AddAlunoTurmaDto } from './dtos/add-aluno-turma.dto';
import { AddProfessorTurmaDto } from './dtos/add-professor-turma.dto';
import { CreateTurmaDto } from './dtos/create-turma.dto';
import { UpdateAlunoTurmaDto } from './dtos/update-aluno-turma.dto';
import { UpdateTurmaDto } from './dtos/update-turma.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { TurmaEntity } from './entities/turma.entity';
import { TurmaService } from './turma.service';

@ApiTags('Turma')
@ApiBearerAuth()
@Controller('turma')
export class TurmaController {
  constructor(private readonly service: TurmaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('turma.create')
  @ApiOperation({ summary: 'Criar turma' })
  @ApiResponse({ status: 201, type: TurmaEntity })
  async criar(@Body() dto: CreateTurmaDto): Promise<TurmaEntity> {
    return this.service.criar(dto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Listar todas as turmas' })
  @ApiResponse({ status: 200, type: [TurmaEntity] })
  async listar(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<TurmaEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const { data, total } = await this.service.listar(
      (page - 1) * limit,
      limit,
    );
    return new PaginatedResult(data, total, page, limit);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Buscar turma por ID' })
  @ApiResponse({ status: 200, type: TurmaEntity })
  async buscarPorId(@Param('id') id: string): Promise<TurmaEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.update')
  @ApiOperation({ summary: 'Atualizar turma' })
  @ApiResponse({ status: 200, type: TurmaEntity })
  async atualizar(
    @Param('id') id: string,
    @Body() dto: UpdateTurmaDto,
  ): Promise<TurmaEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('turma.update')
  @ApiOperation({ summary: 'Deletar turma' })
  @ApiResponse({ status: 204 })
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }

  @Post(':id/aluno')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('student.assign')
  @ApiOperation({ summary: 'Adicionar aluno à turma' })
  @ApiResponse({ status: 204 })
  async adicionarAluno(
    @Param('id') id: string,
    @Body() dto: AddAlunoTurmaDto,
  ): Promise<void> {
    return this.service.adicionarAluno(id, dto);
  }

  @Patch(':id/aluno/:alunoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('student.assign')
  @ApiOperation({ summary: 'Atualizar status ativo/inativo do aluno na turma' })
  @ApiResponse({ status: 204 })
  async atualizarAlunoNaTurma(
    @Param('id') id: string,
    @Param('alunoId') alunoId: string,
    @Body() dto: UpdateAlunoTurmaDto,
  ): Promise<void> {
    return this.service.atualizarAlunoNaTurma(id, alunoId, dto);
  }

  @Post(':id/professor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('turma.update')
  @ApiOperation({ summary: 'Adicionar professor à turma' })
  @ApiResponse({ status: 204 })
  async adicionarProfessor(
    @Param('id') id: string,
    @Body() dto: AddProfessorTurmaDto,
  ): Promise<void> {
    return this.service.adicionarProfessor(id, dto);
  }

  @Get(':id/alunos')
  @UseGuards(PermissionsGuard)
  @Permissions('student.list.by_turma')
  @ApiOperation({ summary: 'Listar alunos de uma turma' })
  @ApiResponse({ status: 200, type: [AlunoEntity] })
  async listarAlunos(
    @Param('id') id: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<AlunoEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const { data, total } = await this.service.listarAlunos(
      id,
      (page - 1) * limit,
      limit,
    );
    return new PaginatedResult(data, total, page, limit);
  }

  @Get(':id/professores')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Listar professores de uma turma' })
  @ApiResponse({ status: 200, type: [ProfessorEntity] })
  async listarProfessores(
    @Param('id') id: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<ProfessorEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const { data, total } = await this.service.listarProfessores(
      id,
      (page - 1) * limit,
      limit,
    );
    return new PaginatedResult(data, total, page, limit);
  }

  @Delete(':id/aluno/:alunoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('remove.student')
  @ApiOperation({ summary: 'Remover aluno da turma' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Turma ou vínculo não encontrado' })
  async removerAlunoDaTurma(
    @Param('id') id: string,
    @Param('alunoId') alunoId: string,
  ): Promise<void> {
    return this.service.removerAlunoDaTurma(id, alunoId);
  }
}
