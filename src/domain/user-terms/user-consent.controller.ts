import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserTermsService } from './user-terms.service';
import { UserTerms } from './user-terms.entity';

@Controller('user-consent')
export class UserConsentController {
  constructor(private readonly userTermsService: UserTermsService) {}

  @Get('/:id')
  async getAllUserTerms(@Param('id') userId: string): Promise<UserTerms[]> {
    try {
      return await this.userTermsService.getUserTermsByUserId(userId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve user acceptance terms',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
