import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateProfessorDto } from './dtos/create-professor.dto.js';
import { ProfessorEntity } from './entities/professor.entity.js';
import { ProfessorService } from './professor.service.js';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly service: ProfessorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CreateProfessorDto): Promise<ProfessorEntity> {
    return this.service.criar(dto);
  }
}
