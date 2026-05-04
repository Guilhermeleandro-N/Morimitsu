import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const PROFESSOR_PERMISSIONS = [
  { codigo: 'turma.create', descricao: 'Criar turma' },
  { codigo: 'turma.read', descricao: 'Visualizar turma' },
  { codigo: 'turma.update', descricao: 'Atualizar turma' },
  { codigo: 'student.create', descricao: 'Criar aluno' },
  { codigo: 'student.read', descricao: 'Visualizar aluno' },
  { codigo: 'student.update', descricao: 'Atualizar aluno' },
  { codigo: 'student.status.update', descricao: 'Atualizar status do aluno' },
  { codigo: 'student.rank.update', descricao: 'Atualizar graduação do aluno' },
  { codigo: 'student.assign', descricao: 'Adicionar aluno à turma' },
  { codigo: 'student.list.by_turma', descricao: 'Listar alunos da turma' },
  { codigo: 'attendance.create', descricao: 'Registrar presença' },
  { codigo: 'attendance.read', descricao: 'Visualizar presença' },
  { codigo: 'attendance.update', descricao: 'Atualizar presença' },
  {
    codigo: 'attendance.history.read',
    descricao: 'Visualizar histórico de presença',
  },
  { codigo: 'training.create', descricao: 'Marcar treino' },
  { codigo: 'training.update', descricao: 'Editar treino' },
  { codigo: 'training.cancel', descricao: 'Cancelar treino' },
  { codigo: 'training.read', descricao: 'Visualizar treino' },
  { codigo: 'student.profile.read', descricao: 'Visualizar perfil do aluno' },
];

const ALUNO_PERMISSIONS = [
  { codigo: 'profile.read', descricao: 'Visualizar próprio perfil' },
  { codigo: 'attendance.read', descricao: 'Visualizar presença' },
  { codigo: 'training.read', descricao: 'Visualizar treino' },
];

async function main() {
  for (const perm of [...PROFESSOR_PERMISSIONS, ...ALUNO_PERMISSIONS]) {
    await prisma.permission.upsert({
      where: { codigo: perm.codigo },
      update: {},
      create: perm,
    });
  }

  const professor = await prisma.perfil.upsert({
    where: { id: 'perfil-professor' },
    update: {},
    create: {
      id: 'perfil-professor',
      nome: 'PROFESSOR',
      descricao: 'Perfil do professor',
    },
  });

  const aluno = await prisma.perfil.upsert({
    where: { id: 'perfil-aluno' },
    update: {},
    create: { id: 'perfil-aluno', nome: 'ALUNO', descricao: 'Perfil do aluno' },
  });

  const allPermissions = await prisma.permission.findMany();
  const permMap = new Map(allPermissions.map((p) => [p.codigo, p.id]));

  for (const perm of PROFESSOR_PERMISSIONS) {
    const permissionId = permMap.get(perm.codigo);
    if (!permissionId) continue;
    await prisma.perfilPermission.upsert({
      where: {
        perfil_id_permission_id: {
          perfil_id: professor.id,
          permission_id: permissionId,
        },
      },
      update: {},
      create: { perfil_id: professor.id, permission_id: permissionId },
    });
  }

  for (const perm of ALUNO_PERMISSIONS) {
    const permissionId = permMap.get(perm.codigo);
    if (!permissionId) continue;
    await prisma.perfilPermission.upsert({
      where: {
        perfil_id_permission_id: {
          perfil_id: aluno.id,
          permission_id: permissionId,
        },
      },
      update: {},
      create: { perfil_id: aluno.id, permission_id: permissionId },
    });
  }

  // Usuário admin padrão (sem vínculo com aluno/professor → role admin automática)
  const senhaHash = await argon2.hash('Admin@1234');
  await prisma.usuario.upsert({
    where: { email: 'admin@morimitsu.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@morimitsu.com',
      senha: senhaHash,
    },
  });

  console.log('Seed concluída. Admin: admin@morimitsu.com / Admin@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
