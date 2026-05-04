import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

@Injectable()
export class TokenBlacklistService {
  private readonly revokedTokens = new Map<string, number>();

  revoke(token: string, expiresAtMs?: number): void {
    const hash = this.hashToken(token);
    const defaultTtlMs = 8 * 60 * 60 * 1000;
    const fallbackExpiry = Date.now() + defaultTtlMs;
    this.revokedTokens.set(hash, expiresAtMs ?? fallbackExpiry);
  }

  isRevoked(token: string): boolean {
    const hash = this.hashToken(token);
    const expiresAt = this.revokedTokens.get(hash);

    if (!expiresAt) {
      return false;
    }

    if (Date.now() > expiresAt) {
      this.revokedTokens.delete(hash);
      return false;
    }

    return true;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
