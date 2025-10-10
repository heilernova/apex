import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth';
import { RegisterDto } from './dto/register.dto';
import { IUser, UserRepository } from '../../repositories/user';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) { }

  private payload(user: IUser): JwtPayload {
    return {
      id: user.id,
      role: user.role,
      isCoach: user.isCoach,
      isJudge: user.judgeLevel !== null,
      permissions: user.permissions,
      name: user.alias || `${user.firstName} ${user.lastName}`,
      gender: user.gender,
      verified: user.verified,

    };
  }

  /**
   * Registrar ultimo inicio de sesión y actualizar el JWT secret
   * @param userId 
   */
  public async updateLastLogin(userId: string): Promise<boolean> {
    const result = await this._userRepository.update(userId, { lastLoginAt: new Date() });
    return result ? true : false;
  }

  public async validateUser(credentials: LoginDto) {
    // Aquí iría la lógica para validar el usuario contra la base de datos
    const user = await this._userRepository.get(credentials.username);
    if (!user) {
      throw new BadRequestException({ message: 'El usuario es incorrecto' });
    }

    const isPasswordValid = await verify(user.passwordHash, credentials.password);
    if (!isPasswordValid) {
      throw new BadRequestException({ message: 'La contraseña es incorrecta' });
    }

    const jwtPayload = this.payload(user);

    const token = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d', secret: `${process.env.JWT_REFRESH_SECRET}+${user.jwtSecret}` });
    await this.updateLastLogin(user.id);
    const warnings = [];
    if (!user.email.verified){
      warnings.push('El correo electrónico no está verificado');
    }

    return {
      warnings: warnings.length > 0 ? warnings : undefined,
      data: {
        accessToken: token,
        refreshToken: refreshToken,
        sessionInfo: {
          role: user.role,
          isCoach: user.isCoach,
          isJudge: user.judgeLevel !== null,
          permissions: user.permissions,
          name: user.alias || `${user.firstName} ${user.lastName}`
        },
      }
    }
  }

  public async register(data: RegisterDto) {
    const user = await this._userRepository.create(data);

    const jwtPayload = this.payload(user);

    const token = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d', secret: `${process.env.JWT_REFRESH_SECRET}+${user.jwtSecret}` });
    
    return {
      accessToken: token,
      refreshToken: refreshToken,
      sessionInfo: {
        role: user.role,
        isCoach: user.isCoach,
        isJudge: user.judgeLevel !== null,
        permissions: user.permissions,
        name: user.alias || `${user.firstName} ${user.lastName}`
      }
    };
  }

  public async refresh(token: string) {
    const decode = this.jwtService.decode<{ sub: unknown }>(token);
    if (typeof decode.sub !== 'string') {
      throw new UnauthorizedException({ message: 'Token inválido' });
    }
    
    const userId = decode.sub;

    const user = await this._userRepository.get(userId);

    if (!user) {
      throw new UnauthorizedException({ message: 'Usuario no encontrado' });
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException({ message: 'El usuario no está activo' });
    }

    const payload = this.payload(user);

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d', secret: `${process.env.JWT_REFRESH_SECRET}+${user.jwtSecret}` });
  
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      sessionInfo: {
        role:   user.role,
        isCoach: user.isCoach,
        isJudge: user.judgeLevel !== null,
        permissions: user.permissions,
        name: user.alias || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      } 
    };
  }
}
