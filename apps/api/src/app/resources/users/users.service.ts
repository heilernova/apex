import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ApiUserInfo  } from '@app/api-types/users';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository, IUser } from '../../repositories/user';


@Injectable()
export class UsersService {

  constructor(
    private readonly _usersRepository: UserRepository
  ) {}

  private mapToAccountInfo(user: IUser): ApiUserInfo {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,

      verified: user.verified,
      status: user.status,
      role: user.role,
      username: user.username,
      email: user.email,
      cellphone: user.cellphone,

      alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      birthdate: user.birthdate,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,

      isCoach: user.isCoach,
      judgeLevel: user.judgeLevel,
      
      category: user.category,
      nationality: user.nationality,
      
      location: user.location,
      disciplines: user.disciplines,
      
      avatar: user.avatar,
      cover: user.cover,
      athletePhoto: user.athletePhoto,
      socialMedia: user.socialMedia,

      gym: user.gym ? {
        id: user.gym.id,
        name: user.gym.name,
        role: user.gym.role,
        status: 'active',
        joinedDate: user.gym.joinedDate.toISOString(),
      } : null, 
    }
  }

  async create(createUserDto: CreateUserDto) {
    const userId = await this._usersRepository.create(createUserDto);
    const user = await this._usersRepository.get(userId);
    if (!user) {
      throw new HttpException('User not found after creation', 404);
    }
    return {
      data: this.mapToAccountInfo(user)
    }
  }

  async findAll() {
    const users = await this._usersRepository.getAll();
    return {
      data: users.map(user => this.mapToAccountInfo(user))
    }
  }

  async findOne(id: string) {
    const user = await this._usersRepository.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToAccountInfo(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this._usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this._usersRepository.delete(id);
  }
}
