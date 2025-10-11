import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AuthSession } from '../../../auth';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-user-menu-panel',
  imports: [
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './user-menu-panel.html',
  styleUrl: './user-menu-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuPanel {
  private readonly _nzDrawerRef = inject(NzDrawerRef<UserMenuPanel>);
  private readonly _nzModalService = inject(NzModalService);
  private readonly _authSession = inject(AuthSession);
  logout(): void {
    this._nzModalService.confirm({
      nzTitle: '¿Estás seguro que deseas cerrar sesión?',
      nzOkText: 'Cerrar sesión',
      nzOkType: 'primary',
      nzOnOk: () => {
        this._authSession.logout();
        this._nzDrawerRef.close();
      }
    });
  }
}
