import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'app-layout-footer',
  imports: [
    Icon
  ],
  templateUrl: './layout-footer.html',
  styleUrl: './layout-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutFooter {

}
