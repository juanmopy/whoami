import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { Experience } from '@models/index';

@Component({
  selector: 'app-timeline',
  imports: [AnimateOnScrollDirective],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  readonly experiences = input.required<Experience[]>();
}
