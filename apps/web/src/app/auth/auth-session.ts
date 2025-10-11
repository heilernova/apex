import { inject, Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthSession {
  private readonly _platform = inject(Platform);
  private _data: IAuthSessionData | null = null;
  private _data$ = new BehaviorSubject<IAuthSessionData | null>(null);

  constructor() {
    if (this._platform.isBrowser) {
      const session = localStorage.getItem('session');  
      if (session) {
        this._data = JSON.parse(session);
        this._data$.next(this._data);
      }
    }
  }

  public data$() {
    return this._data$.asObservable();
  }

  public setData(data: IAuthSessionData | null) {
    this._data = data;
    this._data$.next(this._data);
    if (data) {
      localStorage.setItem('session', JSON.stringify(data));
    } else {
      localStorage.removeItem('session');
    }
  }

  public getData() {
    return this._data;
  }

  public getAccessToken() {
    return this._data?.accessToken || null;
  }

  public getRefreshToken() {
    return this._data?.refreshToken || null;
  }

  public authenticated() {
    return this._data !== null;
  }

  public logout() {
    this.setData(null);
  }
}

export interface IAuthSessionData {
  accessToken: string;
  refreshToken: string;
  sessionInfo: {
    role: string;
    isCoach: boolean;
    isJudge: boolean;
    permissions: string[];
    name: string
  };
}
