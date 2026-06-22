import { ApiProperty } from '@nestjs/swagger';

export class CatalogoPermissoesEntity {
  @ApiProperty({
    type: [String],
    example: ['turma.read', 'turma.update', 'turma.create'],
  })
  turma!: string[];

  @ApiProperty({ type: [String] })
  aluno!: string[];

  @ApiProperty({ type: [String] })
  frequencia!: string[];

  @ApiProperty({ type: [String] })
  treino!: string[];

  @ApiProperty({ type: [String] })
  professor!: string[];

  @ApiProperty({ type: [String] })
  notificacao!: string[];

  @ApiProperty({ type: [String] })
  telas!: string[];
}

export class PerfilCompletoEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty({ type: CatalogoPermissoesEntity })
  permissoes!: CatalogoPermissoesEntity;
}

export class PerfilResumoEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  total_permissoes!: number;
}

export class UsuarioPerfilEntity {
  @ApiProperty()
  usuario_id!: string;

  @ApiProperty()
  perfil_id!: string;

  @ApiProperty()
  perfil_nome!: string;
}
