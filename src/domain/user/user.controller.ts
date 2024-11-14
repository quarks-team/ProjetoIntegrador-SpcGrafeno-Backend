import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { DeleteResult } from 'typeorm';
import { Response } from 'express';
import { UpdateConsentTerms } from './update-consent-terms.request';

const UserSchema = {
  value: {
    username: 'user',
    password: 'boa pa nois',
    email: 'teste@teste.com.br',
    phoneNumber: '(12) 99820-0292',
    companyId: 1,
  },
};
const UserConsentUpdateSchema = {
  value: {
    userId: 1,
    consentStatus: true,
  },
};
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Post()
  @ApiBody({
    type: User,
    examples: { user: UserSchema },
  })
  async createUser(@Body() user: User): Promise<User> {
    return await this.userService.create(user);
  }

  @Post('/update-user-consent')
  @ApiBody({
    type: User,
    examples: { user: UserConsentUpdateSchema },
  })
  async updateConsentSta(@Body() payload: UpdateConsentTerms) {
    await this.userService.acceptanceTerms(
      payload.userId,
      payload.consentStatus,
    );
  }

  @Post('login')
  @ApiBody({
    type: User,
    examples: { user: UserSchema },
  })
  async login(
    @Body() user: Partial<User>,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.userService.login(user);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
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
