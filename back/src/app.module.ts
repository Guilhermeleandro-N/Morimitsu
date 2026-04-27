import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AlunoModule } from './aluno/aluno.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthMiddleware } from './auth/middlewares/jwt-auth.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AlunoModule,
    AuthModule,
  ],
  providers: [JwtAuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: '', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/refresh-token', method: RequestMethod.POST },
        { path: 'auth/usuarios', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
