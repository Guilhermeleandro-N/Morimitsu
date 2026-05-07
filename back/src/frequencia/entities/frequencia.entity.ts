export class FrequenciaEntity {
  id!: string;
  aluno_id!: string;
  professor_id!: string;
  turma_id!: string;
  data!: Date;
  horario_inicio!: Date;
  horario_fim!: Date;
  status_presenca!: string;
}
