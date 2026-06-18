import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoRepository } from './notificacao.repository';
import { NotificacaoService } from './notificacao.service';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [NotificacaoController],
  providers: [NotificacaoService, NotificacaoRepository],
})
export class NotificacaoModule {}
