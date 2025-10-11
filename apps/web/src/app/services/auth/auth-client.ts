import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiAuthLoginResponse, ApiAuthRegisterBody } from '@app/schemas/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthClient {
  private readonly _http = inject(HttpClient);

  public login(credentials: { username: string; password: string }) {
    return this._http.post<ApiAuthLoginResponse['data']>('/auth/login', credentials);
  }

  public register(data: ApiAuthRegisterBody) {
    return this._http.post<ApiAuthLoginResponse['data']>('/auth/register', data);
  }
}
