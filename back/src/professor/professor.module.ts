import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProfessorController } from './professor.controller.js';
import { ProfessorRepository } from './professor.repository.js';
import { ProfessorService } from './professor.service.js';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [ProfessorController],
  providers: [ProfessorService, ProfessorRepository],
})
export class ProfessorModule {}
