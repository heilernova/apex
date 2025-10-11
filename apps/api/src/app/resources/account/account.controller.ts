import {
  Controller,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthSession, CurrentSession } from '../../auth';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('info')
  public async getInfo(@CurrentSession() session: AuthSession) {
    return await this.accountService.getInfo(session.id);
  }

  @Patch('info')
  public async updateInfo(
    @CurrentSession() session: AuthSession,
    @Body() body: UpdateAccountDto
  ) {
    return await this.accountService.updateInfo(session.id, body);
  }
}
