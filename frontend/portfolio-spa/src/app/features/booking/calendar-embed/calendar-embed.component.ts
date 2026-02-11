import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CalGlobal {
  (...args: any[]): void;
  loaded?: boolean;
  ns?: Record<string, (...args: any[]) => void>;
  q?: any[];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const CAL_NAMESPACE = 'inline';
const CAL_ORIGIN = 'https://app.cal.com';
const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';

@Component({
  selector: 'app-calendar-embed',
  imports: [TranslatePipe],
  templateUrl: './calendar-embed.component.html',
  styleUrl: './calendar-embed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEmbedComponent {
  private readonly destroyRef = inject(DestroyRef);
  private initialized = false;

  readonly calLink = input('juanmopy/30min');

  protected readonly loaded = signal(false);
  protected readonly error = signal(false);

  protected get fallbackUrl(): string {
    return `https://cal.com/${this.calLink()}`;
  }

  constructor() {
    afterNextRender(() => {
      this.bootstrapCal();
    });

    // Re-initialize embed when calLink changes after bootstrap
    effect(() => {
      const link = this.calLink();
      if (this.initialized) {
        this.clearEmbed();
        this.renderInline(link);
      }
    });
  }

  /**
   * Bootstrap Cal.com embed using the official IIFE pattern with namespaces.
   * Injects the Cal queue function, loads the script, then initializes.
   */
  private bootstrapCal(): void {
    const win = window as unknown as Record<string, unknown>;

    // Inject the Cal.com IIFE bootstrap (official pattern)
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

    // Load the embed script
    const script = document.createElement('script');
    script.src = CAL_SCRIPT_URL;
    script.async = true;
    document.head.appendChild(script);

    const Cal = win['Cal'] as CalGlobal;
    Cal.loaded = true;

    script.onerror = () => {
      this.error.set(true);
    };

    this.destroyRef.onDestroy(() => script.remove());

    // Initialize namespace and render
    Cal('init', CAL_NAMESPACE, { origin: CAL_ORIGIN });

    this.initialized = true;
    this.loaded.set(true);
    this.renderInline(this.calLink());

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!this.loaded() && !this.error()) {
        this.error.set(true);
      }
    }, 10_000);
    this.destroyRef.onDestroy(() => clearTimeout(timeout));
  }

  private renderInline(calLink: string): void {
    const Cal = (window as unknown as Record<string, unknown>)['Cal'] as CalGlobal | undefined;
    const ns = Cal?.ns?.[CAL_NAMESPACE];
    if (ns) {
      ns('inline', {
        elementOrSelector: '#cal-embed',
        config: { layout: 'month_view' },
        calLink,
      });
      ns('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    }
  }

  private clearEmbed(): void {
    const el = document.getElementById('cal-embed');
    if (el) {
      el.innerHTML = '';
    }
  }
}
