import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutHeader } from './layout-header/layout-header';
import { LayoutFooter } from './layout-footer/layout-footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [
    LayoutHeader,
    LayoutFooter,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}
