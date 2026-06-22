import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BulkTogglePermissoesDto, AtribuirPerfilDto } from './dtos/perfil.dto';
import {
  CatalogoPermissoesEntity,
  PerfilCompletoEntity,
  PerfilResumoEntity,
  UsuarioPerfilEntity,
} from './entities/perfil.entity';
import { PerfilRepository } from './perfil.repository';

const PROGRESSAO_FAIXAS = [
  'BRANCA',
  'CINZA',
  'AMARELA',
  'LARANJA',
  'VERDE',
  'AZUL',
  'ROXA',
  'MARROM',
  'PRETA',
];

const INDICE_ROXA = PROGRESSAO_FAIXAS.indexOf('ROXA'); // 6

const MODULOS: Record<string, string> = {
  turma: 'turma',
  student: 'aluno',
  attendance: 'frequencia',
  training: 'treino',
  professor: 'professor',
  notification: 'notificacao',
  screen: 'telas',
};

@Injectable()
export class PerfilService {
  constructor(private readonly repository: PerfilRepository) {}

  async listarPermissoesAgrupadas(): Promise<CatalogoPermissoesEntity> {
    const permissoes = await this.repository.buscarTodasPermissoes();
    const catalogo = new CatalogoPermissoesEntity();
    catalogo.turma = [];
    catalogo.aluno = [];
    catalogo.frequencia = [];
    catalogo.treino = [];
    catalogo.professor = [];
    catalogo.notificacao = [];
    catalogo.telas = [];

    for (const p of permissoes) {
      const prefixo = p.codigo.split('.')[0];
      const modulo = MODULOS[prefixo];
      if (!modulo) continue;

      const arr = catalogo[modulo as keyof CatalogoPermissoesEntity];
      arr.push(p.codigo);
    }

    return catalogo;
  }

  async listarPerfis(): Promise<PerfilResumoEntity[]> {
    const perfis = await this.repository.buscarPerfis();
    return perfis.map((p) => ({
      id: p.id,
      nome: p.nome,
      total_permissoes: p._count.perfilPermissions,
    }));
  }

  async buscarPerfil(id: string): Promise<PerfilCompletoEntity> {
    const perfil = await this.repository.buscarPerfilPorId(id);
    if (!perfil) throw new NotFoundException('Perfil não encontrado');

    const catalogo = new CatalogoPermissoesEntity();
    catalogo.turma = [];
    catalogo.aluno = [];
    catalogo.frequencia = [];
    catalogo.treino = [];
    catalogo.professor = [];
    catalogo.notificacao = [];
    catalogo.telas = [];

    for (const pp of perfil.perfilPermissions) {
      const prefixo = pp.permission.codigo.split('.')[0];
      const modulo = MODULOS[prefixo];
      if (!modulo) continue;

      const arr = catalogo[modulo as keyof CatalogoPermissoesEntity];
      arr.push(pp.permission.codigo);
    }

    return { id: perfil.id, nome: perfil.nome, permissoes: catalogo };
  }

  async togglePermissoes(
    perfilId: string,
    dto: BulkTogglePermissoesDto,
  ): Promise<PerfilCompletoEntity> {
    const perfil = await this.repository.buscarPerfilPorId(perfilId);
    if (!perfil) throw new NotFoundException('Perfil não encontrado');

    if (dto.remover?.length) {
      const permissoes = await this.repository.buscarPermissoesPorCodigo(
        dto.remover,
      );
      for (const p of permissoes) {
        await this.repository.deletePerfilPermission(perfilId, p.id);
      }
    }

    if (dto.adicionar?.length) {
      const permissoes = await this.repository.buscarPermissoesPorCodigo(
        dto.adicionar,
      );
      for (const p of permissoes) {
        await this.repository.upsertPerfilPermission(perfilId, p.id);
      }
    }

    return this.buscarPerfil(perfilId);
  }

  async listarPerfisUsuario(usuarioId: string): Promise<UsuarioPerfilEntity[]> {
    const perfis = await this.repository.buscarPerfisDoUsuario(usuarioId);
    return perfis.map((p) => ({
      usuario_id: usuarioId,
      perfil_id: p.perfil_id,
      perfil_nome: p.perfil.nome,
    }));
  }

  async atribuirPerfil(
    usuarioId: string,
    dto: AtribuirPerfilDto,
  ): Promise<{ mensagem: string }> {
    const perfil = await this.repository.buscarPerfilPorId(dto.perfil_id);
    if (!perfil) throw new NotFoundException('Perfil não encontrado');

    if (dto.acao === 'adicionar') {
      if (dto.perfil_id === 'perfil-professor') {
        const aluno = await this.repository.buscarAlunoPorUsuarioId(usuarioId);
        if (aluno) {
          const indiceFaixa = PROGRESSAO_FAIXAS.indexOf(aluno.faixa);
          if (indiceFaixa < INDICE_ROXA) {
            throw new BadRequestException(
              `Aluno precisa ser no mínimo faixa ROXA para ser promovido a professor. Faixa atual: ${aluno.faixa}`,
            );
          }
        }

        const jaEhProfessor =
          await this.repository.usuarioTemProfessor(usuarioId);
        if (!jaEhProfessor) {
          const faixaInicial = aluno?.faixa ?? 'ROXA';
          const grauInicial = aluno?.grau_faixa ?? 0;
          await this.repository.criarProfessor(
            usuarioId,
            faixaInicial,
            grauInicial,
          );
        }
      }

      await this.repository.upsertUserPerfil(usuarioId, dto.perfil_id);
      return {
        mensagem: `Perfil "${perfil.nome}" atribuído ao usuário com sucesso. O usuário precisa reautenticar para que as mudanças tenham efeito.`,
      };
    }

    if (dto.perfil_id === 'perfil-professor') {
      const jaEhProfessor =
        await this.repository.usuarioTemProfessor(usuarioId);
      if (jaEhProfessor) {
        await this.repository.deletarProfessor(usuarioId);
      }
    }

    await this.repository.deleteUserPerfil(usuarioId, dto.perfil_id);
    return {
      mensagem: `Perfil "${perfil.nome}" removido do usuário com sucesso. O usuário precisa reautenticar para que as mudanças tenham efeito.`,
    };
  }
}
