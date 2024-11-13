import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { UserTermsService } from './user-terms.service';
import { UserTerms } from './user-terms.entity';
import { UpdateUserConsentRequest } from './user-consents.requests';

@Controller('user-consent')
export class UserConsentController {
  constructor(private readonly userTermsService: UserTermsService) {}

  @Get('/:id')
  async getAllUserTerms(@Param('id') userId: number): Promise<UserTerms[]> {
    try {
      return await this.userTermsService.getUserTermsByUserId(userId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve user policies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/update')
  @ApiBody({ type: UpdateUserConsentRequest })
  async updateUserConsent(@Body() userConsents: UpdateUserConsentRequest) {
    try {
      await this.userTermsService.updateUserConsents(
        userConsents.userId,
        userConsents.consents,
      );
      return { message: 'User consent updated successfully' }; // Optionally return a success message
    } catch (error) {
      throw new HttpException(
        'Failed to update user consent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
