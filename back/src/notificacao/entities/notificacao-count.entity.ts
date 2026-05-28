import { ApiProperty } from '@nestjs/swagger';

export class NotificacaoCountEntity {
  @ApiProperty()
  count!: number;
}
