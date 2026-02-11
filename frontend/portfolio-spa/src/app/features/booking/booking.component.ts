import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CalendarEmbedComponent } from './calendar-embed/calendar-embed.component';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';

export interface MeetingType {
  readonly id: string;
  readonly title: string;
  readonly duration: string;
  readonly description: string;
  readonly calLink: string;
}

const MEETING_TYPES: readonly MeetingType[] = [
  {
    id: 'intro',
    title: 'Intro',
    duration: '30 minutos',
    description: 'Conversación inicial para conocer tu proyecto y ver cómo puedo ayudarte.',
    calLink: 'juanmopy/30min',
  },
  {
    id: 'consulting',
    title: 'Consultoría',
    duration: '60 minutos',
    description:
      'Sesión en profundidad para revisar arquitectura, código o planificar un proyecto.',
    calLink: 'juanmopy/60min',
  },
];

@Component({
  selector: 'app-booking',
  imports: [CalendarEmbedComponent, AnimateOnScrollDirective],
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
