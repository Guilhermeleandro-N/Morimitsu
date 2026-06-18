import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiResponse({ status: 201, type: UserEntity })
  async criar(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.service.criar(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, type: [UserEntity] })
  async listar(): Promise<UserEntity[]> {
    return this.service.listar();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, type: UserEntity })
  async buscarPorId(@Param('id') id: string): Promise<UserEntity> {
    return this.service.buscarPorId(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, type: UserEntity })
  async atualizar(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiResponse({ status: 204 })
  async deletar(@Param('id') id: string): Promise<void> {
    return this.service.deletar(id);
  }
}
