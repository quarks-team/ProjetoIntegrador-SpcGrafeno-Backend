import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { User } from 'src/domain/entites/user';
import { UserService } from 'src/domain/services/user.service';
import { DeleteResult } from 'typeorm';

const UserSchema = {
  value: {
    username: 'user',
    password: 'boa pa nois',
    email: 'teste@teste.com.br',
    phoneNumber: '(12) 99820-0292',
    companyId: 1,
  },
};
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getHello();
  }

  @Post()
  @ApiBody({
    type: User,
    examples: { user: UserSchema },
  })
  async createUser(@Body() user: User): Promise<User> {
    return await this.userService.create(user);
  }

  @Patch()
  @ApiBody({
    type: User,
    examples: {
      user: {
        value: {
          ...UserSchema.value,
          id: 1,
        },
      },
    },
  })
  async updateUser(@Body() user: User): Promise<User> {
    return await this.userService.update(user);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
  })
  async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.delete(id);
  }
}
