import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from '../../auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  public async login(@Body() body: LoginDto) {
    return this.authService.validateUser(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register(body);
    return {
      message: 'Registro exitoso',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        sessionInfo: result.sessionInfo
      },
    };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    const result = await this.authService.refresh(body.refreshToken);
    return {
      message: 'Token refrescado exitosamente',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        sessionInfo: result.sessionInfo
      },
    };
  }
}
