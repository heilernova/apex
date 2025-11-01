import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutFooter } from './layout-footer/layout-footer';
import { LayoutHeader } from './layout-header/layout-header';

@Component({
  selector: 'app-layout',
  imports: [
    LayoutHeader,
    LayoutFooter
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {

}
