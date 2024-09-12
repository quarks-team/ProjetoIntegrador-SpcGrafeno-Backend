import { Controller, Get } from '@nestjs/common';
import { User } from 'src/domain/entites/user';
import { UserService } from 'src/domain/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getHello();
  }
}
