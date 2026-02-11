import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Project } from '@models/index';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-project-card',
  imports: [TranslatePipe],
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
