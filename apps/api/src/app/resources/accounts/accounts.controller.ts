import { Controller, Get, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { GetAccountsQueryDto } from './dto/get-accounts-query.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  public async getAll(@Query() query: GetAccountsQueryDto) {
    const accounts = await this.accountsService.getAll(query);
    return {
      data: {
        total: accounts.length,
        accounts,
      },
    };
  }
}
