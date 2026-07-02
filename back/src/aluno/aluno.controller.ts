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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../authorization/decorators/permissions.decorator';
import { PermissionsGuard } from '../authorization/guards/permissions.guard';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dtos/create-aluno.dto';
import { GraduarAlunoDto } from './dtos/graduar-aluno.dto';
import { UpdateAlunoDto } from './dtos/update-aluno.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { AlunoEntity } from './entities/aluno.entity';

@ApiTags('Aluno')
@ApiBearerAuth()
@Controller('aluno')
export class AlunoController {
  constructor(private readonly service: AlunoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('student.create')
  @ApiOperation({ summary: 'Criar aluno vinculado a um usuário existente' })
  @ApiResponse({ status: 201, type: AlunoEntity })
  @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Usuário já é aluno' })
  async criar(@Body() dto: CreateAlunoDto): Promise<AlunoEntity> {
    return this.service.criar(dto);
  }

  @Get('meu-perfil')
  @UseGuards(PermissionsGuard)
  @Permissions('profile.read')
  @ApiOperation({
    summary:
      'Ver meu perfil completo (aluno logado): dados pessoais, faixa, histórico de frequências',
  })
  @ApiResponse({ status: 200, type: AlunoEntity })
  async meuPerfil(@CurrentUser() usuario: JwtPayload): Promise<AlunoEntity> {
    return this.service.buscarMeuPerfil(usuario.sub);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('student.read')
  @ApiOperation({ summary: 'Listar todos os alunos' })
  @ApiResponse({ status: 200, type: [AlunoEntity] })
  async listar(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<AlunoEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    return this.service.listar((page - 1) * limit, limit);
  }

  @Get('minha-turma')
  @UseGuards(PermissionsGuard)
  @Permissions('student.list.by_turma')
  @ApiOperation({
    summary: 'Listar alunos das turmas do professor logado (ativos e inativos)',
  })
  @ApiResponse({ status: 200, type: [AlunoEntity] })
  async listarDaMinhaTurma(
    @CurrentUser() usuario: JwtPayload,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<AlunoEntity>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    return this.service.listarDaTurmaDoProfessor(
      usuario.sub,
      (page - 1) * limit,
      limit,
    );
  }

  @Get('usuario/:usuarioId')
  @UseGuards(PermissionsGuard)
  @Permissions('student.read')
  @ApiOperation({ summary: 'Buscar aluno por ID de usuário' })
  @ApiResponse({ status: 200, type: AlunoEntity })
  async buscarPorUsuarioId(
    @Param('usuarioId') usuarioId: string,
  ): Promise<AlunoEntity> {
    return this.service.buscarPorUsuarioId(usuarioId);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('student.read')
  @ApiOperation({ summary: 'Buscar aluno por ID' })
  @ApiResponse({ status: 200, type: AlunoEntity })
  async buscarPorId(@Param('id') id: string): Promise<AlunoEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('student.update')
  @ApiOperation({ summary: 'Atualizar aluno' })
  @ApiResponse({ status: 200, type: AlunoEntity })
  async atualizar(
    @Param('id') id: string,
    @Body() dto: UpdateAlunoDto,
  ): Promise<AlunoEntity> {
    return this.service.atualizar(id, dto);
  }

  @Patch(':id/graduar')
  @UseGuards(PermissionsGuard)
  @Permissions('student.rank.update')
  @ApiOperation({
    summary:
      'Graduar aluno manualmente ou automaticamente pela frequência acumulada',
  })
  @ApiResponse({ status: 200, type: AlunoEntity })
  async graduar(
    @Param('id') id: string,
    @Body() dto: GraduarAlunoDto,
  ): Promise<AlunoEntity> {
    return this.service.graduar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionsGuard)
  @Permissions('student.update')
  @ApiOperation({ summary: 'Deletar aluno' })
  @ApiResponse({ status: 204 })
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
