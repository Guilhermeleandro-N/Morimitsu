import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthorizationService } from '../authorization/authorization.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async criar(dto: CreateUserDto): Promise<UserEntity> {
    const existente = await this.repository.buscarPorEmail(dto.email);
    if (existente) throw new ConflictException('Email já cadastrado');
    const entity = await this.repository.criar(dto);
    return this.enriquecer(entity);
  }

  async listar(): Promise<UserEntity[]> {
    const entities = await this.repository.listar();
    return Promise.all(entities.map((e) => this.enriquecer(e)));
  }

  async buscarPorId(id: string): Promise<UserEntity> {
    const entity = await this.repository.buscarPorId(id);
    if (!entity) throw new NotFoundException('Usuário não encontrado');
    return this.enriquecer(entity);
  }

  async atualizar(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Usuário não encontrado');

    if (dto.email && dto.email !== existente.email) {
      const emailEmUso = await this.repository.buscarPorEmail(dto.email);
      if (emailEmUso) throw new ConflictException('Email já cadastrado');
    }

    const entity = await this.repository.atualizar(id, dto);
    if (!entity) throw new NotFoundException('Usuário não encontrado');
    return this.enriquecer(entity);
  }

  async deletar(id: string): Promise<void> {
    const existente = await this.repository.buscarPorId(id);
    if (!existente) throw new NotFoundException('Usuário não encontrado');
    await this.repository.deletar(id);
  }

  private async enriquecer(entity: UserEntity): Promise<UserEntity> {
    entity.permissoes = await this.authorizationService.getUserPermissions(
      entity.id,
    );
    return entity;
  }
}
