import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Project } from '@models/index';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  readonly viewDetail = output<Project>();

  protected onViewDetail(): void {
    this.viewDetail.emit(this.project());
  }
}
