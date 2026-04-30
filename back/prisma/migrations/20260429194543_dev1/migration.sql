-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPerfil" (
    "usuario_id" TEXT NOT NULL,
    "perfil_id" TEXT NOT NULL,

    CONSTRAINT "UserPerfil_pkey" PRIMARY KEY ("usuario_id","perfil_id")
);

-- CreateTable
CREATE TABLE "PerfilPermission" (
    "perfil_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "PerfilPermission_pkey" PRIMARY KEY ("perfil_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_codigo_key" ON "Permission"("codigo");

-- AddForeignKey
ALTER TABLE "UserPerfil" ADD CONSTRAINT "UserPerfil_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerfil" ADD CONSTRAINT "UserPerfil_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermission" ADD CONSTRAINT "PerfilPermission_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermission" ADD CONSTRAINT "PerfilPermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
