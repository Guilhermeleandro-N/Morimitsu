import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '../authorization/decorators/permissions.decorator.js';
import { PermissionsGuard } from '../authorization/guards/permissions.guard.js';
import { AlunoService } from './aluno.service.js';
import { CreateAlunoDto } from './dtos/create-aluno.dto.js';
import { AlunoEntity } from './entities/aluno.entity.js';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly service: AlunoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('student.create')
  async criar(@Body() dto: CreateAlunoDto): Promise<AlunoEntity> {
    return this.service.criar(dto);
  }
}
