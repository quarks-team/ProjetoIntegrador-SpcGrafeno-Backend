import { ApiProperty } from '@nestjs/swagger';

export class Consent {
  @ApiProperty({ description: 'The unique ID of the consent' })
  id: number;

  @ApiProperty({ description: 'The status of the consent', example: true })
  status: boolean;

  @ApiProperty({
    description: 'Indicates if the consent is mandatory',
    example: false,
  })
  isMandatory: boolean;
}

export class UpdateUserConsentRequest {
  @ApiProperty({
    description: 'The user ID for whom the consents are being updated',
  })
  userId: number;

  @ApiProperty({
    description: 'Array of consents with their statuses',
    type: [Consent],
  })
  consents: Consent[];
}
