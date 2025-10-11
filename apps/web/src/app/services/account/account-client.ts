import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiAccountInfoResponse } from '@app/schemas/api/account';

@Injectable({
  providedIn: 'root'
})
export class AccountClient {
  private readonly _http = inject(HttpClient);
  public getInfo() {
    return this._http.get<ApiAccountInfoResponse['data']>('/account/info');
  }
}
