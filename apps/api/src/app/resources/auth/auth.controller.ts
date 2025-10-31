import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { CurrentSession, Public, Session } from '../../auth';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  public async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  
  @Public()
  @Post('refresh')
  public async refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Public()
  @Post('register')
  public async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('validate-session')
  public async validateSession(@CurrentSession() session: Session) {
    return this.authService.validateSession(session);
  }
}
