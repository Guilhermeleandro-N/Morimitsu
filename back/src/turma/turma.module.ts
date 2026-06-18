import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TurmaController } from './turma.controller';
import { TurmaRepository } from './turma.repository';
import { TurmaService } from './turma.service';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [TurmaController],
  providers: [TurmaService, TurmaRepository],
  exports: [TurmaRepository],
})
export class TurmaModule {}
