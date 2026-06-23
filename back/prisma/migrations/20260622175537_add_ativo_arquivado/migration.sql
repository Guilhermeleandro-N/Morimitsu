-- AlterTable
ALTER TABLE "aluno_turma" ADD COLUMN     "arquivado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "turma" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;
