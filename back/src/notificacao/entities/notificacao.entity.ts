import { ApiProperty } from '@nestjs/swagger';

export class NotificacaoEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  professor_id!: string;

  @ApiProperty()
  aluno_id!: string;

  @ApiProperty()
  mensagem!: string;

  @ApiProperty()
  lida!: boolean;

  @ApiProperty()
  created_at!: Date;
}
