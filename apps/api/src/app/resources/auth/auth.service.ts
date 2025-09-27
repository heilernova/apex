import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {  DbUser, DbUserInsert } from '@app/schemas/db';
import { hash, verify } from 'argon2';
import { isEmail } from 'class-validator';
import { DatabaseService } from '../../database/database.service';
import { JwtPayload } from '../../auth';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) { }

  private payload(user: DbUser): JwtPayload {
    return {
      id: user.id,
      role: user.role,
      isCoach: user.is_coach,
      isJudge: user.is_judge,
      permissions: user.permissions,
      name: user.alias || `${user.first_name} ${user.last_name}`,
      gender: user.gender,
      verified: user.verified,

    };
  }

  /**
   * Registrar ultimo inicio de sesión y actualizar el JWT secret
   * @param userId 
   */
  public async updateLastLogin(userId: string): Promise<boolean> {
    const result = await this.databaseService.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [userId]);
    return result.rowCount === 1;
  }

  public async validateUser(username: string, password: string) {
    // Aquí iría la lógica para validar el usuario contra la base de datos
    const user = (await this.databaseService.query<DbUser>(`SELECT * FROM users WHERE lower(${isEmail(username) ? 'email' : 'username'}) = lower($1)`, [username])).rows[0] ?? null;
    if (!user) {
      throw new BadRequestException({ message: 'El usuario es incorrecto' });
    }

    const isPasswordValid = await verify(user.password_hash, password);
    if (!isPasswordValid) {
      throw new BadRequestException({ message: 'La contraseña es incorrecta' });
    }

    const jwtPayload = this.payload(user);

    const token = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d', secret: `${process.env.JWT_REFRESH_SECRET}+${user.jwt_secret}` });
    await this.updateLastLogin(user.id);
    const warnings = [];
    if (!user.email_verified){
      warnings.push('El correo electrónico no está verificado');
    }

    return {
      accessToken: token,
      refreshToken: refreshToken,
      sessionInfo: {
        role: user.role,
        isCoach: user.is_coach,
        isJudge: user.is_judge,
        permissions: user.permissions,
        name: user.alias || `${user.first_name} ${user.last_name}`
      },
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  public async register(data: RegisterDto) {
    // Aquí iría la lógica para registrar un nuevo usuario en la base de datos
    const values: DbUserInsert = {
      status: 'active',
      role: 'user',
      is_coach: false,
      email: data.email,
      cellphone: data.cellphone,
      username: data.username,
      alias: data.alias ?? null,
      first_name: data.firstName,
      last_name: data.lastName,
      birthdate: new Date(data.birthdate),
      height: data.height,
      weight: data.weight,
      city_id: data.cityId,
      nationality: data.nationality,
      password_hash: await hash(data.password),
      gender: data.gender
    }



    const user =(await this.databaseService.insert<DbUser>({
      table: 'users',
      data: values,
      returning: '*'
    })).rows[0];

    // Registrar el peso
    await this.databaseService.insert({
      table: 'user_weights',
      data: {
        user_id: user.id,
        weight: data.weight
      },
      returning: '*'
    });

    const jwtPayload = this.payload(user);

    const token = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d', secret: `${process.env.JWT_REFRESH_SECRET}+${user.jwt_secret}` });
    
    return {
      accessToken: token,
      refreshToken: refreshToken,
      sessionInfo: {
        role: user.role,
        isCoach: user.is_coach,
        isJudge: user.is_judge,
        permissions: user.permissions,
        name: user.alias || `${user.first_name} ${user.last_name}`
      }
    };
  }

  public async refresh(token: string) {
    const decode = this.jwtService.decode<{ sub: unknown }>(token);
    if (typeof decode.sub !== 'string') {
      throw new UnauthorizedException({ message: 'Token inválido' });
    }
    
    const userId = decode.sub;

    const user: DbUser | null = (await this.databaseService.query(`SELECT * FROM users WHERE id = $1`, [userId])).rows[0] ?? null;

    if (!user) {
      throw new UnauthorizedException({ message: 'Usuario no encontrado' });
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException({ message: 'El usuario no está activo' });
    }

    const payload = this.payload(user);

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d', secret: `${process.env.JWT_REFRESH_SECRET}+${user.jwt_secret}` });
  
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      sessionInfo: {
        role:   user.role,
        isCoach: user.is_coach,
        isJudge: user.is_judge,
        permissions: user.permissions,
        name: user.alias || `${user.first_name || ''} ${user.last_name || ''}`.trim()
      } 
    };
  }
}
