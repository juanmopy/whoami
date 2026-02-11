import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { SkillBarComponent } from './skills/skill-bar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SkillCategory } from '@models/index';
import { Experience } from '@models/index';

@Component({
  selector: 'app-about',
  imports: [SkillBarComponent, TimelineComponent, AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly skills = signal<SkillCategory[]>([]);
  protected readonly experiences = signal<Experience[]>([]);

  ngOnInit(): void {
    this.http
      .get<SkillCategory[]>('assets/data/skills.json')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.skills.set(data));

    this.http
      .get<Experience[]>('assets/data/experience.json')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.experiences.set(data));
  }
}
