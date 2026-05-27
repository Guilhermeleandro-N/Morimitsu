import { Module } from '@nestjs/common';
import { AlunoModule } from '../aluno/aluno.module.js';
import { AuthorizationModule } from '../authorization/authorization.module.js';
import { ProfessorModule } from '../professor/professor.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UserPerfilService } from './user-perfil.service.js';
import { UserController } from './user.controller.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

@Module({
  imports: [PrismaModule, AlunoModule, ProfessorModule, AuthorizationModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserPerfilService],
  exports: [UserService, UserPerfilService],
})
export class UserModule {}
