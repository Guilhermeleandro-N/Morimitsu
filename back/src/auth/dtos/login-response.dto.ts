export class LoginResponseDto {
  userId!: string;
  nome!: string;
  email!: string;
  roles!: string[];
  token!: string;
  refreshToken!: string;
}
