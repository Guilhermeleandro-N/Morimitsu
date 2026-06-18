export class AuthEntity {
  id!: string;
  nome!: string;
  email!: string;
  senhaHash!: string;
  telefone!: string | null;
  status!: string;
  roles!: string[];
  permissoes!: string[];

  isEnabled(): boolean {
    return this.status === 'ENABLED';
  }
}
