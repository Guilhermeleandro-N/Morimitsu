import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserEntity } from './entities/user.entity.js';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.service.criar(dto);
  }

  @Get()
  async listar(): Promise<UserEntity[]> {
    return this.service.listar();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string): Promise<UserEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  async atualizar(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
