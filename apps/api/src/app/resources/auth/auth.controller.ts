import { Body, Controller, Post } from '@nestjs/common';
import { ApiAuthLoginResponse } from '@app/schemas/api/auth';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() body: LoginDto): Promise<ApiAuthLoginResponse> {
    const result = await this.authService.validateUser(body.username, body.password);
    return {
      message: 'Inicio de sesión exitoso',
      warnings: result.warnings ? result.warnings : undefined,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        sessionInfo: result.sessionInfo
      },
    };
  }

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
