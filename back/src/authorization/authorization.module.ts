import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthorizationRepository } from './authorization.repository';
import { AuthorizationService } from './authorization.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [AuthorizationService, AuthorizationRepository, PermissionsGuard],
  exports: [AuthorizationService, PermissionsGuard],
})
export class AuthorizationModule {}
