-- CreateTable
CREATE TABLE "UserPermission" (
    "usuario_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "is_removed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("usuario_id","permission_id")
);

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
