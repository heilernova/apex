import { inject, Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { AccountClient } from './account-client';
import { AthleteCategory, JudgeLevel, UserGender, UserRole } from '@app/schemas/types';

@Injectable({
  providedIn: 'root'
})
export class AccountDataSource {
  private readonly _accountClient = inject(AccountClient);
  private info: IAccountInfo | null = null;
  private readonly _platform = inject(Platform);

  public getInfo(refresh?: boolean): Promise<IAccountInfo> {
    return new Promise((resolve, reject) => {

      if (this.info && !refresh){
        resolve(this.info);
        return;
      }

      this._accountClient.getInfo().subscribe({
        next: res => {
          this.info = {
            username: res.username,
            email: res.email,
            cellphone: res.cellphone,
            firstName: res.firstName,
            lastName: res.lastName,
            alias: res.alias,
            gender: res.gender,
            birthdate: res.birthdate,
            height: res.height,
            weight: res.weight,
            cityId: res.cityId,
            nationality: res.nationality,
            permissions: res.permissions,
            isCoach: res.isCoach,
            judgeLevel: res.judgeLevel,
            role: res.role,
            category: res.category,
            verified: res.verified

          }
          resolve(res);
        },
        error: err => reject(err)
      })
    })
  }
}


export interface IAccountInfo {
  username: string;
  email: string;
  cellphone: string;
  firstName: string;
  lastName: string;
  alias: string | null;
  gender: UserGender;
  birthdate: Date;
  height: number;
  weight: number;
  cityId: string;
  nationality: string;
  permissions: string[];
  isCoach: boolean;
  judgeLevel: JudgeLevel | null;
  role: UserRole;
  category: AthleteCategory;
  verified: boolean;
}