import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiLoginResponse, ApiRefreshResponse } from '@app/api-types/account';
import { verify } from 'argon2';
import { IUser, UserRepository } from '../../repositories/user';
import { JwtPayload, RefreshTokenPayload, Session } from '../../auth';
import { ConfigService } from '../../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) { }

  private generateAccessToken(user: IUser): string {
    const payload: JwtPayload = {
      id: user.id,
      name: user.alias || `${user.firstName} ${user.lastName}`.trim(),
      role: user.role,
      gender: user.gender,
      isCoach: user.isCoach,
      judgeLevel: user.judgeLevel,
      permissions: user.permissions,
      verified: user.verified,
      sessionKey: user.sessionKey,
    };

    return this._jwtService.sign(payload);
  }

  private generateRefreshToken(user: IUser): string {
    const payload: RefreshTokenPayload = {
      sub: user.sessionKey,
    };
    const secret = this._configService.jwtSecret + '+' + user.jwtSecret;
    return this._jwtService.sign(payload, { expiresIn: '90d', secret });
  }

  public async login(credentials: { username: string; password: string }): Promise<ApiLoginResponse> {
    const user = await this._userRepository.get(credentials.username);
    if (!user) {
      throw new BadRequestException('Usuario invalido');
    }

    const passwordValid = await verify(user.passwordHash, credentials.password);
    if (!passwordValid) {
      throw new BadRequestException('Contraseña invalida');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      data: {
        accessToken,
        refreshToken,
        sessionInfo: {
          name: user.alias || `${user.firstName} ${user.lastName}`.trim(),
          role: user.role,
          gender: user.gender,
          isCoach: user.isCoach,
          judgeLevel: user.judgeLevel,
          permissions: user.permissions,
          verified: user.verified,
        }
      }
    }
  }

  public async refresh(token: string): Promise<ApiRefreshResponse> {
    const decoded = this._jwtService.decode(token);
    if (!decoded || typeof decoded !== 'object' || !('sub' in decoded)) {
      throw new UnauthorizedException('Token inválido');
    }

    const sessionKey = decoded['sub'] as string;

    const user = await this._userRepository.getBySessionKey(sessionKey);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      data: {
        accessToken,
        refreshToken,
        sessionInfo: {
          name: user.alias || `${user.firstName} ${user.lastName}`.trim(),
          role: user.role,
          gender: user.gender,
          isCoach: user.isCoach,
          judgeLevel: user.judgeLevel,
          permissions: user.permissions,
          verified: user.verified,
        }
      }
    }
  }

  /**
   * RUTA: /auth/validate
   * @param session 
   * @returns 
   */
  public async validateSession(session: Session) {
    const user = await this._userRepository.get(session.id);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    if (user.sessionKey !== session.sessionKey) {
      throw new UnauthorizedException('Sesión inválida');
    }

    // Validamos que el usuario siga teniendo acceso al sistema
    if (user.status !== 'active') {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    // Verificamos si hubo cambios en el usuario que requieran un nuevo token
    if (session.isCoach === user.isCoach &&
      session.role === user.role &&
      session.judgeLevel === user.judgeLevel &&
      session.verified === user.verified &&
      session.name === (user.alias || `${user.firstName} ${user.lastName}`.trim()) &&
      session.gender === user.gender) {
      return;
    }
    
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      data: {
        accessToken,
        refreshToken,
        sessionInfo: {
          name: user.alias || `${user.firstName} ${user.lastName}`.trim(),
          role: user.role,
          gender: user.gender,
          isCoach: user.isCoach,
          judgeLevel: user.judgeLevel,
          permissions: user.permissions,
          verified: user.verified,
        }
      }
    }
  }
}
