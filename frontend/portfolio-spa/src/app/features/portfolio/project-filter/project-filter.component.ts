import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrl: './project-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilterComponent {
  readonly tags = input.required<string[]>();
  readonly selectedTags = input.required<string[]>();
  readonly filterChange = output<string[]>();

  protected toggleTag(tag: string): void {
    const current = this.selectedTags();
    const updated = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    this.filterChange.emit(updated);
  }

  protected clearFilters(): void {
    this.filterChange.emit([]);
  }

  protected isSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }
}
