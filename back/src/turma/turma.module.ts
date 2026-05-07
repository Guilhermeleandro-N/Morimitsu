import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TurmaController } from './turma.controller.js';
import { TurmaRepository } from './turma.repository.js';
import { TurmaService } from './turma.service.js';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [TurmaController],
  providers: [TurmaService, TurmaRepository],
  exports: [TurmaRepository],
})
export class TurmaModule {}
