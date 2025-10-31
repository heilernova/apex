import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiAccountInfoResponse } from '@app/api-types/account';
import { verify } from 'argon2';
import { UserRepository } from '../../repositories/user';
import { Session } from '../../auth';
import { UpdateAccountDto } from './dto/account-update.dto';
import { GeoRepository } from '../../repositories/geo';

@Injectable()
export class AccountService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _geoRepository: GeoRepository,
  ) {}

  public async getAccountInfo(session: Session): Promise<ApiAccountInfoResponse> {
    const user = await this._userRepository.get(session.id);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return {
      data: {
        username: user.username,
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,

        judgeLevel: user.judgeLevel,
        gender: user.gender,
        birthdate: user.birthdate,
        age: user.age,
        height: user.height,
        weight: user.weight,
        location: user.location,
        nationality: user.nationality,
        category: user.category,
        cellphone: user.cellphone,
        email: user.email,
        verified: user.verified,
        
      }
    }
  }

  public async updateAccountInfo(session: Session, data: UpdateAccountDto): Promise<void> {
    if (data.locationId) {
      const exists = await this._geoRepository.existsAdministrativeDivision(data.locationId);
      if (!exists) {
        throw new BadRequestException('La ubicación proporcionada no es válida');
      }
    }
    this._userRepository.update(session.id, data);
  }

  public async updatePassword(session: Session, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.get(session.id);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordValid = await verify(user.passwordHash, currentPassword);
    if (!passwordValid) {
      throw new BadRequestException('Contraseña actual inválida');
    }

    await this._userRepository.update(session.id, { password: newPassword });
  }
}
