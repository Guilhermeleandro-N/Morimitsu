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
import { UserAlunoResponseDto } from './dtos/user-aluno-response.dto.js';
import { UserProfessorResponseDto } from './dtos/user-professor-response.dto.js';
import { CreateUserAlunoDto } from './dtos/create-user-aluno.dto.js';
import { CreateUserProfessorDto } from './dtos/create-user-professor.dto.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserAlunoDto } from './dtos/update-user-aluno.dto.js';
import { UpdateUserProfessorDto } from './dtos/update-user-professor.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';
import { UserPerfilService } from './user-perfil.service.js';
import { UserService } from './user.service.js';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly perfilService: UserPerfilService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiResponse({ status: 201, type: UserEntity })
  async criar(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.service.criar(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, type: [UserEntity] })
  async listar(): Promise<UserEntity[]> {
    return this.service.listar();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, type: UserEntity })
  async buscarPorId(@Param('id') id: string): Promise<UserEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, type: UserEntity })
  async atualizar(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiResponse({ status: 204 })
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }

  // ── Rotas compostas (usuário + perfil) ──────────────────────────────────

  @Post('aluno')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions('student.create')
  @ApiOperation({
    summary:
      'Cadastrar usuário + perfil aluno em uma única requisição (professor ou admin)',
  })
  @ApiResponse({ status: 201, type: UserAlunoResponseDto })
  @ApiResponse({ status: 403, description: 'Permissão insuficiente' })
  async criarComAluno(
    @Body() dto: CreateUserAlunoDto,
  ): Promise<UserAlunoResponseDto> {
    return this.perfilService.criarComAluno(dto);
  }

  @Post('professor')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions('professor.create')
  @ApiOperation({
    summary:
      'Cadastrar usuário + perfil professor em uma única requisição (somente admin)',
  })
  @ApiResponse({ status: 201, type: UserProfessorResponseDto })
  @ApiResponse({ status: 403, description: 'Permissão insuficiente' })
  async criarComProfessor(
    @Body() dto: CreateUserProfessorDto,
  ): Promise<UserProfessorResponseDto> {
    return this.perfilService.criarComProfessor(dto);
  }

  @Patch('aluno/:usuarioId')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions('student.update')
  @ApiOperation({
    summary:
      'Atualizar usuário + perfil aluno em uma única requisição (professor ou admin)',
  })
  @ApiResponse({ status: 200, type: UserAlunoResponseDto })
  @ApiResponse({ status: 403, description: 'Permissão insuficiente' })
  async atualizarComAluno(
    @Param('usuarioId') usuarioId: string,
    @Body() dto: UpdateUserAlunoDto,
  ): Promise<UserAlunoResponseDto> {
    return this.perfilService.atualizarComAluno(usuarioId, dto);
  }

  @Patch('professor/:usuarioId')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions('professor.update')
  @ApiOperation({
    summary:
      'Atualizar usuário + perfil professor em uma única requisição (somente admin)',
  })
  @ApiResponse({ status: 200, type: UserProfessorResponseDto })
  @ApiResponse({ status: 403, description: 'Permissão insuficiente' })
  async atualizarComProfessor(
    @Param('usuarioId') usuarioId: string,
    @Body() dto: UpdateUserProfessorDto,
  ): Promise<UserProfessorResponseDto> {
    return this.perfilService.atualizarComProfessor(usuarioId, dto);
  }
}
