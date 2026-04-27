import { Module } from '@nestjs/common';
import { AlunoController } from './aluno.controller.js';
import { AlunoService } from './aluno.service.js';
import { AlunoRepository } from './aluno.repository.js';

@Module({
  controllers: [AlunoController],
  providers: [AlunoService, AlunoRepository],
  exports: [AlunoService],
})
export class AlunoModule {}
