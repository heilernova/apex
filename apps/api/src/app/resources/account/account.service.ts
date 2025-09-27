import { HttpException, Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from '../../database/database.service';
import { IUserInfo } from './interfaces/user-info.interfaces';
import { DbUserUpdate } from '@app/schemas/db';

@Injectable()
export class AccountService {

  constructor(private readonly _db: DatabaseService) {}

  public async getInfo(userId: string) {
    const sql =`select
      u.username,
      u.email,
      u.cellphone,
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.alias,
      u.gender,
      u.birthdate,
      u.height,
      u.weight,
      u.city_id AS "cityId",
      u.nationality,
      u.permissions,
      u.is_coach AS "isCoach",
      u.is_judge AS "isJudge",
      u.judge_level AS "judgeLevel",
      u.role,
      u.verified
    from users u
    where u.id = $1;
    `

    const info: IUserInfo | null = (await this._db.query(sql, [userId])).rows[0] ?? null;
    if (!info) {
      throw new HttpException({ message: 'Información del usuario no encontrada' }, 500);
    }
    return info;
  }

  async updateInfo(userId: string, updateData: UpdateAccountDto) {
    const values: DbUserUpdate = {
      first_name: updateData.firstName,
      last_name: updateData.lastName,
      alias: updateData.alias,
      height: updateData.height,
      weight: updateData.weight,
      city_id: updateData.cityId,
      nationality: updateData.nationality,
      email: updateData.email,
      cellphone: updateData.cellphone,
      username: updateData.username,
    }

    const user = await this._db.update<IUserInfo>({
      table: 'users',
      condition: 'id = $1',
      conditionParams: [userId],
      data: values,
      returning: [
        'username',
        'email',
        'cellphone',
        'first_name as "firstName"',
        'last_name as "lastName"',
        'alias',
        'height',
        'weight',
        'city_id as "cityId"',
        'nationality',
        'permissions',
        'is_coach as "isCoach"',
        'is_judge as "isJudge"',
        'judge_level as "judgeLevel"',
        'role',
        'verified',
        'birthdate'
      ]
    })
    return user.rows[0];
  }
}
