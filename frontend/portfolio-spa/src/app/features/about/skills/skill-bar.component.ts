import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SkillCategory } from '@models/index';

@Component({
  selector: 'app-skill-bar',
  imports: [AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './skill-bar.component.html',
  styleUrl: './skill-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillBarComponent {
  readonly categories = input.required<SkillCategory[]>();
}
