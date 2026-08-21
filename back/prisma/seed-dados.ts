import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const PERFIL_ALUNO_ID = 'perfil-aluno';
const PERFIL_PROFESSOR_ID = 'perfil-professor';
const SENHA = 'Aluno@123';

const FAIXAS = [
  'BRANCA',
  'AMARELA',
  'LARANJA',
  'VERDE',
  'AZUL',
  'ROXA',
  'MARROM',
];

function dataCom(
  ano: number,
  mes: number,
  dia: number,
  hora = 0,
  minuto = 0,
): Date {
  return new Date(Date.UTC(ano, mes - 1, dia, hora, minuto));
}

const TURMAS = [
  {
    nome: 'Manhã',
    horario_inicio: dataCom(2026, 1, 1, 8),
    horario_fim: dataCom(2026, 1, 1, 9, 30),
    segunda: true,
    quarta: true,
    sexta: true,
  },
  {
    nome: 'Tarde',
    horario_inicio: dataCom(2026, 1, 1, 14),
    horario_fim: dataCom(2026, 1, 1, 15, 30),
    segunda: true,
    terca: true,
    quinta: true,
  },
  {
    nome: 'Noite',
    horario_inicio: dataCom(2026, 1, 1, 19),
    horario_fim: dataCom(2026, 1, 1, 20, 30),
    terca: true,
    quarta: true,
    sexta: true,
  },
  {
    nome: 'Kids',
    horario_inicio: dataCom(2026, 1, 1, 10),
    horario_fim: dataCom(2026, 1, 1, 11),
    sabado: true,
  },
];

interface AlunoSeed {
  nome: string;
  data_nascimento: Date;
  faixa: string;
  grau_faixa: number;
}

const alunosManha: AlunoSeed[] = [
  { nome: 'Ana Beatriz Souza', data_nascimento: dataCom(2000, 3, 12), faixa: 'AMARELA', grau_faixa: 1 },
  { nome: 'Bruno Cardoso', data_nascimento: dataCom(1998, 7, 25), faixa: 'LARANJA', grau_faixa: 2 },
  { nome: 'Carla Menezes', data_nascimento: dataCom(2002, 11, 3), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Diego Antunes', data_nascimento: dataCom(1995, 1, 18), faixa: 'VERDE', grau_faixa: 1 },
  { nome: 'Elisa Prado', data_nascimento: dataCom(1999, 5, 30), faixa: 'AMARELA', grau_faixa: 0 },
  { nome: 'Felipe Nogueira', data_nascimento: dataCom(2001, 9, 14), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Gabriela Lima', data_nascimento: dataCom(1996, 2, 8), faixa: 'AZUL', grau_faixa: 2 },
  { nome: 'Heitor Ramos', data_nascimento: dataCom(1994, 12, 21), faixa: 'ROXA', grau_faixa: 1 },
  { nome: 'Isabela Castro', data_nascimento: dataCom(2003, 6, 5), faixa: 'LARANJA', grau_faixa: 0 },
  { nome: 'João Pedro Alves', data_nascimento: dataCom(1997, 8, 17), faixa: 'VERDE', grau_faixa: 2 },
];

const alunosTarde: AlunoSeed[] = [
  { nome: 'Kaique Ferreira', data_nascimento: dataCom(1999, 4, 22), faixa: 'AMARELA', grau_faixa: 1 },
  { nome: 'Larissa Gomes', data_nascimento: dataCom(2001, 10, 9), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Marcos Vinícius', data_nascimento: dataCom(1993, 7, 3), faixa: 'AZUL', grau_faixa: 3 },
  { nome: 'Natália Ribeiro', data_nascimento: dataCom(2000, 12, 28), faixa: 'LARANJA', grau_faixa: 1 },
  { nome: 'Otávio Martins', data_nascimento: dataCom(1996, 3, 11), faixa: 'VERDE', grau_faixa: 1 },
  { nome: 'Patrícia Azevedo', data_nascimento: dataCom(1998, 6, 19), faixa: 'AMARELA', grau_faixa: 2 },
  { nome: 'Rafael Teixeira', data_nascimento: dataCom(1995, 9, 27), faixa: 'ROXA', grau_faixa: 0 },
  { nome: 'Sofia Carvalho', data_nascimento: dataCom(2002, 1, 6), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Thiago Mendes', data_nascimento: dataCom(1994, 5, 15), faixa: 'MARROM', grau_faixa: 1 },
  { nome: 'Vitória Assis', data_nascimento: dataCom(2003, 8, 2), faixa: 'VERDE', grau_faixa: 0 },
];

const alunosNoite: AlunoSeed[] = [
  { nome: 'Arthur Siqueira', data_nascimento: dataCom(1992, 6, 7), faixa: 'AZUL', grau_faixa: 2 },
  { nome: 'Beatriz Ferraz', data_nascimento: dataCom(1997, 11, 24), faixa: 'LARANJA', grau_faixa: 1 },
  { nome: 'Caio Sampaio', data_nascimento: dataCom(1990, 4, 13), faixa: 'PRETA', grau_faixa: 1 },
  { nome: 'Daniela Lopes', data_nascimento: dataCom(1996, 9, 1), faixa: 'AMARELA', grau_faixa: 2 },
  { nome: 'Eduardo Costa', data_nascimento: dataCom(1988, 2, 29), faixa: 'PRETA', grau_faixa: 3 },
  { nome: 'Fernanda Barros', data_nascimento: dataCom(1995, 7, 16), faixa: 'VERDE', grau_faixa: 1 },
  { nome: 'Gustavo Reis', data_nascimento: dataCom(1993, 12, 4), faixa: 'ROXA', grau_faixa: 2 },
  { nome: 'Helena Freitas', data_nascimento: dataCom(1999, 3, 9), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Igor Viana', data_nascimento: dataCom(1991, 8, 23), faixa: 'MARROM', grau_faixa: 1 },
  { nome: 'Júlia Santos', data_nascimento: dataCom(1998, 10, 11), faixa: 'LARANJA', grau_faixa: 1 },
];

const alunosKids: AlunoSeed[] = [
  { nome: 'Alice Ramos', data_nascimento: dataCom(2016, 5, 14), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Benjamin Silva', data_nascimento: dataCom(2015, 3, 22), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Clara Dias', data_nascimento: dataCom(2014, 8, 30), faixa: 'AMARELA', grau_faixa: 0 },
  { nome: 'Davi Rocha', data_nascimento: dataCom(2017, 1, 9), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Emanuel Peixoto', data_nascimento: dataCom(2013, 11, 2), faixa: 'AMARELA', grau_faixa: 1 },
  { nome: 'Felipe Júnior', data_nascimento: dataCom(2018, 6, 18), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Giovanna Melo', data_nascimento: dataCom(2014, 4, 25), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Heitor Bandeira', data_nascimento: dataCom(2015, 9, 7), faixa: 'AMARELA', grau_faixa: 0 },
  { nome: 'Íris Camargo', data_nascimento: dataCom(2016, 12, 3), faixa: 'BRANCA', grau_faixa: 0 },
  { nome: 'Miguel Tavares', data_nascimento: dataCom(2013, 2, 19), faixa: 'AMARELA', grau_faixa: 1 },
];

const grupos = [
  { nomeTurma: 'Manhã', alunos: alunosManha },
  { nomeTurma: 'Tarde', alunos: alunosTarde },
  { nomeTurma: 'Noite', alunos: alunosNoite },
  { nomeTurma: 'Kids', alunos: alunosKids },
];

const PROFESSORES = [
  { nome: 'Renato Barros', faixa: 'ROXA', grau: 2 },
  { nome: 'Sandra Meirelles', faixa: 'ROXA', grau: 1 },
  { nome: 'Vitor Hugo Costa', faixa: 'ROXA', grau: 3 },
];

function sobrenomeParaEmail(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.');
}

async function upsertTurmas(): Promise<Map<string, string>> {
  const mapa = new Map<string, string>();
  for (const t of TURMAS) {
    const existente = await prisma.turma.findFirst({
      where: { nome: t.nome },
    });
    const turma = existente
      ? await prisma.turma.update({ where: { id: existente.id }, data: t })
      : await prisma.turma.create({ data: t });
    mapa.set(t.nome, turma.id);
  }
  return mapa;
}

async function upsertAluno(aluno: AlunoSeed, index: number): Promise<string> {
  const email = `aluno.${sobrenomeParaEmail(aluno.nome)}.${index}@morimitsu.com`;
  let usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    const senhaHash = await argon2.hash(SENHA);
    usuario = await prisma.usuario.create({
      data: {
        nome: aluno.nome,
        email,
        senha: senhaHash,
        data_nascimento: aluno.data_nascimento,
        userPerfis: {
          create: { perfil_id: PERFIL_ALUNO_ID },
        },
      },
    });
  }

  await prisma.aluno.upsert({
    where: { usuarioId: usuario.id },
    update: {},
    create: {
      usuarioId: usuario.id,
      faixa: aluno.faixa,
      grau_faixa: aluno.grau_faixa,
      frequencia_atual: 0,
    },
  });

  return usuario.id;
}

async function main() {
  const mapaTurmas = await upsertTurmas();

  const idsPorGrupo = new Map<string, string[]>();
  let contador = 1;
  for (const grupo of grupos) {
    const ids: string[] = [];
    for (const aluno of grupo.alunos) {
      ids.push(await upsertAluno(aluno, contador++));
    }
    idsPorGrupo.set(grupo.nomeTurma, ids);
  }

  for (const [nomeTurma, ids] of idsPorGrupo) {
    const turmaId = mapaTurmas.get(nomeTurma);
    if (!turmaId) continue;
    for (const usuarioId of ids) {
      const aluno = await prisma.aluno.findUnique({ where: { usuarioId } });
      if (!aluno) continue;
      await prisma.alunoTurma.upsert({
        where: {
          aluno_id_turma_id: { aluno_id: aluno.id, turma_id: turmaId },
        },
        update: { frequente: 'S' },
        create: { aluno_id: aluno.id, turma_id: turmaId, frequente: 'S' },
      });
    }
  }

  const turmaNoiteId = mapaTurmas.get('Noite');
  if (turmaNoiteId) {
    const todosAlunos = await prisma.aluno.findMany();
    for (const aluno of todosAlunos) {
      await prisma.alunoTurma.upsert({
        where: {
          aluno_id_turma_id: { aluno_id: aluno.id, turma_id: turmaNoiteId },
        },
        update: { frequente: 'S' },
        create: { aluno_id: aluno.id, turma_id: turmaNoiteId, frequente: 'S' },
      });
    }

    const admin = await prisma.usuario.findUnique({
      where: { email: 'admin@morimitsu.com' },
    });
    if (admin) {
      const professor = await prisma.professor.upsert({
        where: { usuarioId: admin.id },
        update: {},
        create: { usuarioId: admin.id, faixa: 'PRETA', grau: 5 },
      });
      await prisma.professorTurma.upsert({
        where: {
          professor_id_turma_id: {
            professor_id: professor.id,
            turma_id: turmaNoiteId,
          },
        },
        update: {},
        create: { professor_id: professor.id, turma_id: turmaNoiteId },
      });
    }
  }

  const perfilProfessorId = PERFIL_PROFESSOR_ID;
  for (const p of PROFESSORES) {
    const email = `professor.${sobrenomeParaEmail(p.nome)}@morimitsu.com`;
    let usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      const senhaHash = await argon2.hash(SENHA);
      usuario = await prisma.usuario.create({
        data: {
          nome: p.nome,
          email,
          senha: senhaHash,
        },
      });
    }

    await prisma.professor.upsert({
      where: { usuarioId: usuario.id },
      update: {},
      create: {
        usuarioId: usuario.id,
        faixa: p.faixa,
        grau: p.grau,
      },
    });

    await prisma.userPerfil.upsert({
      where: {
        usuario_id_perfil_id: {
          usuario_id: usuario.id,
          perfil_id: perfilProfessorId,
        },
      },
      update: {},
      create: { usuario_id: usuario.id, perfil_id: perfilProfessorId },
    });

    await prisma.aluno.upsert({
      where: { usuarioId: usuario.id },
      update: {},
      create: {
        usuarioId: usuario.id,
        faixa: p.faixa,
        grau_faixa: p.grau,
      },
    });
  }

  const turmas = await prisma.turma.findMany({
    include: { _count: { select: { alunoTurmas: true } } },
  });
  console.log('Turmas cadastradas:');
  for (const t of turmas) {
    console.log(`  ${t.nome}: ${t._count.alunoTurmas} alunos`);
  }
  console.log(`Total de alunos: ${await prisma.aluno.count()}`);
  const professores = await prisma.professor.findMany({
    include: { usuario: { select: { nome: true, email: true } } },
  });
  console.log('Professores:');
  for (const pr of professores) {
    console.log(`  ${pr.faixa} ${pr.grau} — ${pr.usuario.nome} (${pr.usuario.email})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
