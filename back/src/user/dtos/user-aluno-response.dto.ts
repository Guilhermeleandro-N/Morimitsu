import { ApiProperty } from '@nestjs/swagger';
import { AlunoEntity } from '../../aluno/entities/aluno.entity.js';
import { UserEntity } from '../entities/user.entity.js';

export class UserAlunoResponseDto {
  @ApiProperty({ type: UserEntity })
  usuario!: UserEntity;

  @ApiProperty({ type: AlunoEntity })
  aluno!: AlunoEntity;

  @ApiProperty({ type: [String], example: ['aluno'] })
  roles!: string[];

  @ApiProperty({
    type: [String],
    example: ['profile.read', 'attendance.read', 'screen.dashboard'],
  })
  permissoes!: string[];
}
