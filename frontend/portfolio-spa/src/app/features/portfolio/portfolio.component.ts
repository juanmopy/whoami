import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectFilterComponent } from './project-filter/project-filter.component';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Project } from '@models/index';

@Component({
  selector: 'app-portfolio',
  imports: [ProjectCardComponent, ProjectFilterComponent, AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly projects = signal<Project[]>([]);
  protected readonly selectedTags = signal<string[]>([]);
  protected readonly selectedProject = signal<Project | null>(null);

  protected readonly allTags = computed(() => {
    const tagSet = new Set<string>();
    this.projects().forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet].sort();
  });

  protected readonly filteredProjects = computed(() =>
    this.selectedTags().length === 0
      ? this.projects()
      : this.projects().filter((p) => p.tags.some((t) => this.selectedTags().includes(t))),
  );

  ngOnInit(): void {
    this.http
      .get<Project[]>('assets/data/projects.json')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.projects.set(data));
  }

  protected onFilterChange(tags: string[]): void {
    this.selectedTags.set(tags);
  }

  protected onViewDetail(project: Project): void {
    this.selectedProject.set(project);
  }

  protected closeDetail(): void {
    this.selectedProject.set(null);
  }
}
