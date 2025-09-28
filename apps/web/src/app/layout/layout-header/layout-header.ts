import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  imports: [],
  templateUrl: './layout-header.html',
  styleUrl: './layout-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeader {}
