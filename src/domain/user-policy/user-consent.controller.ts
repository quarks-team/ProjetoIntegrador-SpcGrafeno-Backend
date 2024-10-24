import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserPolicyService } from './user-policy.service';
import { UserPolicy } from './user-policy.entity';
import { UpdateUserConsentRequest } from './user-consents.requests';

@Controller('user-consent')
export class UserConsentController {
  constructor(private readonly userPolicyService: UserPolicyService) {}

  @Get('/:id')
  async getAllUserPolicy(@Param('id') userId: number): Promise<UserPolicy[]> {
    return await this.userPolicyService.getUserPolicyByUserId(userId);
  }

  @Post('')
  async updateUserConsent(@Body() userConsents: UpdateUserConsentRequest) {
    return await this.userPolicyService.updateUserConsents(
      userConsents.userId,
      userConsents.consents,
    );
  }
}
