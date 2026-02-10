import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div
      class="skeleton"
      [class.skeleton--text]="variant() === 'text'"
      [class.skeleton--circle]="variant() === 'circle'"
      [class.skeleton--rect]="variant() === 'rect'"
      [class.skeleton--card]="variant() === 'card'"
      [style.width]="width()"
      [style.height]="height()"
      [attr.aria-label]="'Loading content'"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  `,
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly variant = input<SkeletonVariant>('text');
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
}
