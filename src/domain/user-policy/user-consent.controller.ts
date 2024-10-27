import { Body, Controller, Get, Param, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { UserPolicyService } from './user-policy.service';
import { UserPolicy } from './user-policy.entity';
import { UpdateUserConsentRequest } from './user-consents.requests';

@Controller('user-consent')
export class UserConsentController {
  constructor(private readonly userPolicyService: UserPolicyService) {}

  @Get('/:id')
  async getAllUserPolicy(@Param('id') userId: number): Promise<UserPolicy[]> {
    try {
      return await this.userPolicyService.getUserPolicyByUserId(userId);
    } catch (error) {
      throw new HttpException('Failed to retrieve user policies', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/update')
  @ApiBody({ type: UpdateUserConsentRequest }) 
  async updateUserConsent(@Body() userConsents: UpdateUserConsentRequest) {
    try {
      await this.userPolicyService.updateUserConsents(
        userConsents.userId,
        userConsents.consents,
      );
      return { message: 'User consent updated successfully' }; // Optionally return a success message
    } catch (error) {
      throw new HttpException('Failed to update user consent', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
