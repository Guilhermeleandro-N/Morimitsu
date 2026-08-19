-- AlterTable
ALTER TABLE "aluno_turma" ADD COLUMN     "frequencia_atual" INTEGER NOT NULL DEFAULT 0;

-- Backfill: frequencia por turma = contagem de PRESENTE naquela turma
UPDATE "aluno_turma" at
SET "frequencia_atual" = (
  SELECT COUNT(*)::int
  FROM "frequencia_aluno" fa
  WHERE fa."aluno_id" = at."aluno_id"
    AND fa."turma_id" = at."turma_id"
    AND fa.status_presenca = 'PRESENTE'
);
