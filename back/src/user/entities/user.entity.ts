export class UserEntity {
  id!: string;
  nome!: string;
  email!: string;
  telefone!: string | null;
  status!: string;
  roles!: string[];
}
