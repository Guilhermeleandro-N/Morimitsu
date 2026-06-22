import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfilController } from './perfil.controller';
import { PerfilRepository } from './perfil.repository';
import { PerfilService } from './perfil.service';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [PerfilController],
  providers: [PerfilService, PerfilRepository],
})
export class PerfilModule {}
