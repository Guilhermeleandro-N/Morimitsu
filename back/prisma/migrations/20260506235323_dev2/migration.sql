-- CreateTable
CREATE TABLE "turma" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "horario_inicio" TIMESTAMP(3) NOT NULL,
    "horario_fim" TIMESTAMP(3) NOT NULL,
    "data_especifica" TIMESTAMP(3),
    "segunda" BOOLEAN NOT NULL DEFAULT false,
    "terca" BOOLEAN NOT NULL DEFAULT false,
    "quarta" BOOLEAN NOT NULL DEFAULT false,
    "quinta" BOOLEAN NOT NULL DEFAULT false,
    "sexta" BOOLEAN NOT NULL DEFAULT false,
    "sabado" BOOLEAN NOT NULL DEFAULT false,
    "domingo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frequencia_aluno" (
    "id" TEXT NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "turma_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horario_inicio" TIMESTAMP(3) NOT NULL,
    "horario_fim" TIMESTAMP(3) NOT NULL,
    "status_presenca" TEXT NOT NULL,

    CONSTRAINT "frequencia_aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno_turma" (
    "aluno_id" TEXT NOT NULL,
    "turma_id" TEXT NOT NULL,
    "frequente" TEXT NOT NULL DEFAULT 'N',

    CONSTRAINT "aluno_turma_pkey" PRIMARY KEY ("aluno_id","turma_id")
);

-- CreateTable
CREATE TABLE "professor_turma" (
    "professor_id" TEXT NOT NULL,
    "turma_id" TEXT NOT NULL,

    CONSTRAINT "professor_turma_pkey" PRIMARY KEY ("professor_id","turma_id")
);

-- CreateTable
CREATE TABLE "frequencia_prof" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "professor_id" TEXT NOT NULL,
    "turma_id" TEXT NOT NULL,
    "status_aula" TEXT NOT NULL,
    "data_remarcacao" TIMESTAMP(3),

    CONSTRAINT "frequencia_prof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "frequencia_aluno_aluno_id_idx" ON "frequencia_aluno"("aluno_id");

-- CreateIndex
CREATE INDEX "frequencia_aluno_professor_id_idx" ON "frequencia_aluno"("professor_id");

-- CreateIndex
CREATE INDEX "frequencia_aluno_turma_id_idx" ON "frequencia_aluno"("turma_id");

-- CreateIndex
CREATE INDEX "aluno_turma_turma_id_idx" ON "aluno_turma"("turma_id");

-- CreateIndex
CREATE INDEX "professor_turma_turma_id_idx" ON "professor_turma"("turma_id");

-- CreateIndex
CREATE INDEX "frequencia_prof_professor_id_idx" ON "frequencia_prof"("professor_id");

-- CreateIndex
CREATE INDEX "frequencia_prof_turma_id_idx" ON "frequencia_prof"("turma_id");

-- AddForeignKey
ALTER TABLE "frequencia_aluno" ADD CONSTRAINT "frequencia_aluno_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia_aluno" ADD CONSTRAINT "frequencia_aluno_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia_aluno" ADD CONSTRAINT "frequencia_aluno_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_turma" ADD CONSTRAINT "aluno_turma_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_turma" ADD CONSTRAINT "aluno_turma_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_turma" ADD CONSTRAINT "professor_turma_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_turma" ADD CONSTRAINT "professor_turma_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia_prof" ADD CONSTRAINT "frequencia_prof_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia_prof" ADD CONSTRAINT "frequencia_prof_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
