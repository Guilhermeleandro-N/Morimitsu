import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AlunoController } from './aluno.controller';
import { AlunoRepository } from './aluno.repository';
import { AlunoService } from './aluno.service';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [AlunoController],
  providers: [AlunoService, AlunoRepository],
  exports: [AlunoService],
})
export class AlunoModule {}
