import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Experience } from '@models/index';

@Component({
  selector: 'app-timeline',
  imports: [AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  readonly experiences = input.required<Experience[]>();
}
