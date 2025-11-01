import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'app-icon',
  }
})
export class Icon {
  public readonly icon = input.required<IconKeys>();
  protected iconClass = computed(() => {
    return icons[this.icon()];
  });
}

const icons = {
  'moon': 'fa-solid fa-moon',
  'sun': 'fa-solid fa-sun',
  'rotate-right': 'fa-solid fa-rotate-right',
  'xmark': 'fa-solid fa-xmark',
  'pencil': 'fa-solid fa-pencil',
  'calculator': 'fa-solid fa-calculator',
  'exclamation': 'fa-solid fa-exclamation',
  'plus': 'fa-solid fa-plus',
  'trash': 'fa-solid fa-trash',
  'grip-vertical': 'fa-solid fa-grip-vertical',
  'globe': 'fa-solid fa-globe',
  'check': 'fa-solid fa-check',
  'chevron-down': 'fa-solid fa-chevron-down',
  'ellipsis-vertical': 'fa-solid fa-ellipsis-vertical',
  'github': 'fa-brands fa-github',
  'users': 'fa-solid fa-users',
  'weight-hanging': 'fa-solid fa-weight-hanging',
  'dumbbell': 'fa-solid fa-dumbbell',
  'house': 'fa-solid fa-house',
};

type IconKeys = keyof typeof icons;
