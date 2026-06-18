import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  telefone!: string | null;

  @ApiProperty()
  status!: string;

  @ApiProperty({ type: [String] })
  roles!: string[];

  @ApiPropertyOptional({ type: [String], description: 'Permissões do usuário' })
  permissoes?: string[];
}
