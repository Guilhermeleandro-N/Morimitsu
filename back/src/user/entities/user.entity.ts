import { ApiProperty } from '@nestjs/swagger';

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
}
