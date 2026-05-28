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
import { AlunoEntity } from '../aluno/entities/aluno.entity.js';
import { ProfessorEntity } from '../professor/entities/professor.entity.js';
import { AddAlunoTurmaDto } from './dtos/add-aluno-turma.dto.js';
import { AddProfessorTurmaDto } from './dtos/add-professor-turma.dto.js';
import { CreateTurmaDto } from './dtos/create-turma.dto.js';
import { UpdateTurmaDto } from './dtos/update-turma.dto.js';
import { TurmaEntity } from './entities/turma.entity.js';
import { TurmaService } from './turma.service.js';

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
  async listar(): Promise<TurmaEntity[]> {
    return this.service.listar();
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
  async listarAlunos(@Param('id') id: string): Promise<AlunoEntity[]> {
    return this.service.listarAlunos(id);
  }

  @Get(':id/professores')
  @UseGuards(PermissionsGuard)
  @Permissions('turma.read')
  @ApiOperation({ summary: 'Listar professores de uma turma' })
  @ApiResponse({ status: 200, type: [ProfessorEntity] })
  async listarProfessores(@Param('id') id: string): Promise<ProfessorEntity[]> {
    return this.service.listarProfessores(id);
  }
}
