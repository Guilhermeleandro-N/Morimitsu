import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AlunoController } from './aluno.controller.js';
import { AlunoRepository } from './aluno.repository.js';
import { AlunoService } from './aluno.service.js';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [AlunoController],
  providers: [AlunoService, AlunoRepository],
})
export class AlunoModule {}
