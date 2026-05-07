export class TurmaEntity {
  id!: string;
  nome!: string;
  horario_inicio!: Date;
  horario_fim!: Date;
  data_especifica!: Date | null;
  segunda!: boolean;
  terca!: boolean;
  quarta!: boolean;
  quinta!: boolean;
  sexta!: boolean;
  sabado!: boolean;
  domingo!: boolean;
}
