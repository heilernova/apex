import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/account-update.dto';
import { CurrentSession, Session } from '../../auth';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('info')
  public async getAccountInfo(@CurrentSession() session: Session) {
    return this.accountService.getAccountInfo(session);
  }

  @Patch('info')
  public async updateAccountInfo(@CurrentSession() session: Session, @Body() data: UpdateAccountDto) {
    return this.accountService.updateAccountInfo(session, data);
  }


  @Put('password')
  public async updatePassword(@CurrentSession() session: Session, @Body() body: UpdatePasswordDto) {
    return this.accountService.updatePassword(session, body.currentPassword, body.newPassword);
  }
}
