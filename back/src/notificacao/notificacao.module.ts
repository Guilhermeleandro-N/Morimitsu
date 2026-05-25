import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificacaoController } from './notificacao.controller.js';
import { NotificacaoRepository } from './notificacao.repository.js';
import { NotificacaoService } from './notificacao.service.js';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [NotificacaoController],
  providers: [NotificacaoService, NotificacaoRepository],
})
export class NotificacaoModule {}
