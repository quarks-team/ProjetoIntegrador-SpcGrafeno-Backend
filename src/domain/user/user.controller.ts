import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { DeleteResult } from 'typeorm';
import { Response } from 'express';
import { AcceptanceTerm } from '../acceptance-terms/acceptance-term.entity';
import { AuthGuard } from 'src/infra/auth/auth.guard';

const AcceptanceTermsSchema = {
  _id: '6736a1e9e76eb8f3f7b2422a',
  version: 1,
  isActive: true,
  description: 'AcceptanceTerm description',
  items: [
    {
      name: 'padrão',
      description: 'boa',
      tag: 'EMAIL-COMMUNICATION',
      isMandatory: false,
    },
    {
      name: 'mandatória',
      description: 'boa pa nois',
      tag: 'DATA-USAGE',
      isMandatory: true,
    },
  ],
  createdAt: '2024-11-15T00:35:44.582Z',
  restrictions: ['EMAIL-COMMUNICATION'],
  __v: 0,
};

const UserSchema = {
  value: {
    username: 'user',
    password: 'boa pa nois',
    email: 'teste@teste.com.br',
    consentStatus: true,
    acceptanceTerms: AcceptanceTermsSchema,
    consentDate: new Date(),
    cnpj: '123120397102973109',
  },
};

// const UserConsentUpdateSchema = {
//   value: {
//     userId: 1,
//     consentStatus: true,
//   },
// };
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get('/id/:id') 
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
  })
  async getUserById(@Param('id') userId: string, @Res() res: Response): Promise<Response> {
    try {
      const user = await this.userService.getById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  @Post()
  @ApiBody({
    type: User,
    examples: { user: UserSchema },
  })
  async createUser(@Body() user: User): Promise<User> {
    return await this.userService.create(user);
  }

  @Post('login')
  @ApiBody({
    type: User,
    examples: { user: UserSchema },
  })
  @UseGuards()
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async updateUser(@Body() user: User): Promise<User> {
    return await this.userService.update(user);
  }

  @Patch('acceptance-terms')
  @ApiBody({
    type: User,
    examples: {
      userAcceptanceTerms: {
        value: {
          acceptanceTerms: AcceptanceTermsSchema,
          _id: 'idhaowdhoaiwda',
        },
      },
    },
  })
  async updateAcceptanceTerms(@Body() user: Partial<User>): Promise<User> {
    return await this.userService.acceptanceTerms(
      user._id.toString(),
      user.acceptanceTerms as unknown as AcceptanceTerm,
    );
  }

  @Patch('revoke-terms')
  @ApiBody({
    type: User,
    examples: {
      userAcceptanceTerms: {
        value: {
          _id: 'idhaowdhoaiwda',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async revokeAcceptanceTerms(@Body() user: Partial<User>): Promise<User> {
    return await this.userService.revokeTerms(user._id.toString());
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.delete(id);
  }

  @Delete('/badList/lgpd')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async deleteBadListUsers(): Promise<any> {
    return await this.userService.deleteUsersBadList();
  }
}
