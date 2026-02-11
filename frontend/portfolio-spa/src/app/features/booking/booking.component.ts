import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CalGlobal {
  (...args: any[]): void;
  loaded?: boolean;
  ns?: Record<string, (...args: any[]) => void>;
  q?: any[];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const CAL_ORIGIN = 'https://app.cal.com';
const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';

export interface MeetingType {
  readonly id: string;
  readonly titleKey: string;
  readonly durationKey: string;
  readonly descriptionKey: string;
  readonly calLink: string;
  readonly namespace: string;
}

const MEETING_TYPES: readonly MeetingType[] = [
  {
    id: 'intro',
    titleKey: 'booking.intro.title',
    durationKey: 'booking.intro.duration',
    descriptionKey: 'booking.intro.description',
    calLink: 'juanmopy/30min',
    namespace: '30min',
  },
  {
    id: 'consulting',
    titleKey: 'booking.consulting.title',
    durationKey: 'booking.consulting.duration',
    descriptionKey: 'booking.consulting.description',
    calLink: 'juanmopy/60min',
    namespace: '60min',
  },
];

@Component({
  selector: 'app-booking',
  imports: [AnimateOnScrollDirective, TranslatePipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly meetingTypes = MEETING_TYPES;
  protected readonly selectedType = signal<MeetingType>(MEETING_TYPES[0]);
  protected readonly calConfig = JSON.stringify({
    layout: 'month_view',
    useSlotsViewOnSmallScreen: 'true',
  });

  constructor() {
    afterNextRender(() => {
      this.bootstrapCal();
    });
  }

  protected selectType(type: MeetingType): void {
    this.selectedType.set(type);
  }

  /**
   * Bootstrap Cal.com embed using the official IIFE pattern.
   * Creates the Cal queue function, loads the script, and initializes
   * a namespace per meeting type for element-click popup mode.
   */
  private bootstrapCal(): void {
    const win = window as unknown as Record<string, unknown>;

    if (!win['Cal']) {
      const calFn: CalGlobal = function calQueue(...args: unknown[]) {
        const cal = win['Cal'] as CalGlobal;
        const firstArg = args[0];
        if (firstArg === 'init') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const api: any = function apiQueue(...apiArgs: unknown[]) {
            api.q.push(apiArgs);
          };
          const namespace = args[1] as string;
          api.q = api.q ?? [];
          if (typeof namespace === 'string') {
            cal.ns![namespace] = cal.ns![namespace] ?? api;
            cal.ns![namespace](...args);
            cal('initNamespace', namespace);
          } else {
            cal.q!.push(args);
          }
          return;
        }
        cal.q!.push(args);
      } as CalGlobal;
      calFn.q = [];
      calFn.ns = {};
      win['Cal'] = calFn;
    }

    const script = document.createElement('script');
    script.src = CAL_SCRIPT_URL;
    script.async = true;
    document.head.appendChild(script);

    const Cal = win['Cal'] as CalGlobal;
    Cal.loaded = true;

    this.destroyRef.onDestroy(() => script.remove());

    // Initialize each meeting type namespace and configure UI
    for (const type of MEETING_TYPES) {
      Cal('init', type.namespace, { origin: CAL_ORIGIN });
      Cal.ns![type.namespace]('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    }
  }
}
