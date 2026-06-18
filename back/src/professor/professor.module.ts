import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfessorController } from './professor.controller';
import { ProfessorRepository } from './professor.repository';
import { ProfessorService } from './professor.service';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [ProfessorController],
  providers: [ProfessorService, ProfessorRepository],
  exports: [ProfessorService],
})
export class ProfessorModule {}
