import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-layout-header',
  imports: [
    NzButtonModule,
    Icon
  ],
  templateUrl: './layout-header.html',
  styleUrl: './layout-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutHeader {

}
