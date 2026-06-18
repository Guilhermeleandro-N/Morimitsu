import { Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FrequenciaController } from './frequencia.controller';
import { FrequenciaRepository } from './frequencia.repository';
import { FrequenciaService } from './frequencia.service';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [FrequenciaController],
  providers: [FrequenciaService, FrequenciaRepository],
})
export class FrequenciaModule {}
