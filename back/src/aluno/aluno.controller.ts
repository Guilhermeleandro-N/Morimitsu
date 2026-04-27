import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AlunoService } from './aluno.service.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('alunos')
export class AlunoController {
  constructor(private readonly service: AlunoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo aluno' })
  @ApiResponse({
    status: 201,
    description: 'Aluno criado com sucesso',
    type: AlunoEntity,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async criar(@Body() dto: CreateAlunoDto): Promise<AlunoEntity> {
    return this.service.criar(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um aluno por ID' })
  @ApiResponse({
    status: 200,
    description: 'Aluno encontrado',
    type: AlunoEntity,
  })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  async buscarPorId(@Param('id') id: string): Promise<AlunoEntity> {
    return this.service.buscarPorIdOuFalhar(id);
  }
}
