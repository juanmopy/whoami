import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CalendarEmbedComponent } from './calendar-embed/calendar-embed.component';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

export interface MeetingType {
  readonly id: string;
  readonly titleKey: string;
  readonly durationKey: string;
  readonly descriptionKey: string;
  readonly calLink: string;
}

const MEETING_TYPES: readonly MeetingType[] = [
  {
    id: 'intro',
    titleKey: 'booking.intro.title',
    durationKey: 'booking.intro.duration',
    descriptionKey: 'booking.intro.description',
    calLink: 'juanmopy/30min',
  },
  {
    id: 'consulting',
    titleKey: 'booking.consulting.title',
    durationKey: 'booking.consulting.duration',
    descriptionKey: 'booking.consulting.description',
    calLink: 'juanmopy/60min',
  },
];

@Component({
  selector: 'app-booking',
  imports: [CalendarEmbedComponent, AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent {
  protected readonly meetingTypes = MEETING_TYPES;
  protected readonly selectedType = signal<MeetingType>(MEETING_TYPES[0]);
  protected readonly activeCalLink = computed(() => this.selectedType().calLink);

  protected selectType(type: MeetingType): void {
    this.selectedType.set(type);
  }
}
