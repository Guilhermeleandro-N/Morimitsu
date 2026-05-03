import { Injectable } from '@nestjs/common';
import { AuthorizationRepository } from './authorization.repository.js';

@Injectable()
export class AuthorizationService {
  constructor(private readonly repository: AuthorizationRepository) {}

  async getUserPermissions(usuarioId: string): Promise<string[]> {
    return this.repository.getUserPermissions(usuarioId);
  }
}
