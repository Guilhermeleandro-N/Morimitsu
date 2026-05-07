import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { FrequenciaController } from './frequencia.controller.js';
import { FrequenciaRepository } from './frequencia.repository.js';
import { FrequenciaService } from './frequencia.service.js';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [FrequenciaController],
  providers: [FrequenciaService, FrequenciaRepository],
})
export class FrequenciaModule {}
