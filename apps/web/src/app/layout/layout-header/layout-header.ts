import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { AuthSession } from '../../auth';
import { UserMenuPanel } from '../components/user-menu-panel/user-menu-panel';

@Component({
  selector: 'app-layout-header',
  imports: [
    RouterLink,
    NzButtonModule,
    NzDrawerModule
  ],
  templateUrl: './layout-header.html',
  styleUrl: './layout-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeader {
  private readonly _authSession = inject(AuthSession);
  private readonly _nzDrawerService = inject(NzDrawerService);
  protected readonly name = signal<string | null>(null);

  protected readonly  navigationLinks = signal([
    { label: 'Ejercicios', path: '/ejericicos' },
    { label: 'Workouts', path: '/workouts' },
    { label: 'Gimnasios', path: '/gyms' },
    { label: 'Competencias', path: '/compentencias' }
  ]);


  constructor() { 
    this._authSession.data$().subscribe(data => {
      if (data) {
        this.navigationLinks.update(link => [
          ...link,
          { label: 'Comunidad', path: '/comunidad' }
        ]);
      }
      this.name.set(data?.sessionInfo.name || null);
    });
  }

  protected openUserMenu(): void {
    this._nzDrawerService.create({
      nzTitle: this.name() ?? 'Usuario',
      nzContent: UserMenuPanel,
      nzPlacement: 'right',
      nzWidth: 300,
      nzClosable: true,
      nzMaskClosable: true,
      nzBodyStyle: { padding: '16px' }
    });
  }
}
