import { Injectable } from '@nestjs/common';
import { AlunoService } from '../aluno/aluno.service.js';
import { AuthorizationService } from '../authorization/authorization.service.js';
import { ProfessorService } from '../professor/professor.service.js';
import { UserAlunoResponseDto } from './dtos/user-aluno-response.dto.js';
import { UserProfessorResponseDto } from './dtos/user-professor-response.dto.js';
import { CreateUserAlunoDto } from './dtos/create-user-aluno.dto.js';
import { CreateUserProfessorDto } from './dtos/create-user-professor.dto.js';
import { UpdateUserAlunoDto } from './dtos/update-user-aluno.dto.js';
import { UpdateUserProfessorDto } from './dtos/update-user-professor.dto.js';
import { UserService } from './user.service.js';

@Injectable()
export class UserPerfilService {
  constructor(
    private readonly userService: UserService,
    private readonly alunoService: AlunoService,
    private readonly professorService: ProfessorService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async criarComAluno(dto: CreateUserAlunoDto): Promise<UserAlunoResponseDto> {
    const usuario = await this.userService.criar({
      nome: dto.nome,
      email: dto.email,
      senha: dto.senha,
      telefone: dto.telefone,
    });

    try {
      const aluno = await this.alunoService.criar({
        usuarioId: usuario.id,
        faixa: dto.faixa,
        grau_faixa: dto.grau_faixa,
        frequencia_atual: dto.frequencia_atual,
        data_nascimento: dto.data_nascimento,
      });

      const permissoes = await this.authorizationService.getUserPermissions(
        usuario.id,
      );

      return { usuario, aluno, roles: ['aluno'], permissoes };
    } catch (e) {
      await this.userService.deletar(usuario.id);
      throw e;
    }
  }

  async criarComProfessor(
    dto: CreateUserProfessorDto,
  ): Promise<UserProfessorResponseDto> {
    const usuario = await this.userService.criar({
      nome: dto.nome,
      email: dto.email,
      senha: dto.senha,
      telefone: dto.telefone,
    });

    try {
      const professor = await this.professorService.criar({
        usuarioId: usuario.id,
        faixa: dto.faixa,
        grau: dto.grau,
      });

      const permissoes = await this.authorizationService.getUserPermissions(
        usuario.id,
      );

      return { usuario, professor, roles: ['professor'], permissoes };
    } catch (e) {
      await this.userService.deletar(usuario.id);
      throw e;
    }
  }

  async atualizarComAluno(
    usuarioId: string,
    dto: UpdateUserAlunoDto,
  ): Promise<UserAlunoResponseDto> {
    const usuario = await this.userService.atualizar(usuarioId, {
      nome: dto.nome,
      email: dto.email,
      senha: dto.senha,
      telefone: dto.telefone,
    });

    const alunoExistente =
      await this.alunoService.buscarPorUsuarioId(usuarioId);
    const aluno = await this.alunoService.atualizar(alunoExistente.id, {
      faixa: dto.faixa,
      grau_faixa: dto.grau_faixa,
      frequencia_atual: dto.frequencia_atual,
      data_nascimento: dto.data_nascimento,
    });

    const permissoes =
      await this.authorizationService.getUserPermissions(usuarioId);

    return { usuario, aluno, roles: ['aluno'], permissoes };
  }

  async atualizarComProfessor(
    usuarioId: string,
    dto: UpdateUserProfessorDto,
  ): Promise<UserProfessorResponseDto> {
    const usuario = await this.userService.atualizar(usuarioId, {
      nome: dto.nome,
      email: dto.email,
      senha: dto.senha,
      telefone: dto.telefone,
    });

    const professorExistente =
      await this.professorService.buscarPorUsuarioId(usuarioId);
    const professor = await this.professorService.atualizar(
      professorExistente.id,
      {
        faixa: dto.faixa,
        grau: dto.grau,
      },
    );

    const permissoes =
      await this.authorizationService.getUserPermissions(usuarioId);

    return { usuario, professor, roles: ['professor'], permissoes };
  }
}
