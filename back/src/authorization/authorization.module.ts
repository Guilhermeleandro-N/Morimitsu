import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthorizationRepository } from './authorization.repository.js';
import { AuthorizationService } from './authorization.service.js';
import { PermissionsGuard } from './guards/permissions.guard.js';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [AuthorizationService, AuthorizationRepository, PermissionsGuard],
  exports: [AuthorizationService, PermissionsGuard],
})
export class AuthorizationModule {}
