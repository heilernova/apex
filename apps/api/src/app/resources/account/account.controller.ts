import {
  Controller,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiAccountInfoResponse } from '@app/schemas/api/account';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthSession, CurrentSession } from '../../auth';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('info')
  public async getInfo(@CurrentSession() session: AuthSession): Promise<ApiAccountInfoResponse> {
    const userInfo = await this.accountService.getInfo(session.id);
    return { 
      data: userInfo
    };
  }

  @Patch('info')
  public async updateInfo(
    @CurrentSession() session: AuthSession,
    @Body() body: UpdateAccountDto
  ): Promise<ApiAccountInfoResponse> {
    const updatedInfo = await this.accountService.updateInfo(session.id, body);
    return {
      message: 'Información actualizada correctamente',
      data: updatedInfo
    }
  }
}
