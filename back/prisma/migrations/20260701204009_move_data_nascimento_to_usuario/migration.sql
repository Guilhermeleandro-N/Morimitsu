-- Add data_nascimento to Usuario
ALTER TABLE "Usuario" ADD COLUMN "data_nascimento" TIMESTAMP(3);

-- Copy data from Aluno to Usuario
UPDATE "Usuario" u
SET "data_nascimento" = a."data_nascimento"
FROM "Aluno" a
WHERE u.id = a."usuarioId"
  AND a."data_nascimento" IS NOT NULL;

-- Drop column from Aluno
ALTER TABLE "Aluno" DROP COLUMN "data_nascimento";
