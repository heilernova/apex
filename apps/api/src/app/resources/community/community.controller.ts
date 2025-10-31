import { Controller, Get } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('athletes')
  public async getAthletes() {
    return this.communityService.getAthletes();
  }
}
