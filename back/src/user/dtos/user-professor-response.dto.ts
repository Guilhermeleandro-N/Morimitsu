import { ApiProperty } from '@nestjs/swagger';
import { ProfessorEntity } from '../../professor/entities/professor.entity.js';
import { UserEntity } from '../entities/user.entity.js';

export class UserProfessorResponseDto {
  @ApiProperty({ type: UserEntity })
  usuario!: UserEntity;

  @ApiProperty({ type: ProfessorEntity })
  professor!: ProfessorEntity;

  @ApiProperty({ type: [String], example: ['professor'] })
  roles!: string[];

  @ApiProperty({
    type: [String],
    example: [
      'student.create',
      'student.read',
      'turma.read',
      'screen.dashboard',
    ],
  })
  permissoes!: string[];
}
