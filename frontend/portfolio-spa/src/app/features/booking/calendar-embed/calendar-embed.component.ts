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

/** Typed wrapper for Cal.com embed global */
interface CalFunction {
  (action: string, config: Record<string, unknown>): void;
  (action: string, config: { elementOrSelector: string; calLink: string; layout: string }): void;
}

@Component({
  selector: 'app-calendar-embed',
  imports: [TranslatePipe],
  templateUrl: './calendar-embed.component.html',
  styleUrl: './calendar-embed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEmbedComponent {
  private readonly destroyRef = inject(DestroyRef);
  private scriptLoaded = false;

  readonly calLink = input('juanmopy/30min');

  protected readonly loaded = signal(false);
  protected readonly error = signal(false);

  protected get fallbackUrl(): string {
    return `https://cal.com/${this.calLink()}`;
  }

  constructor() {
    afterNextRender(() => {
      this.loadCalScript();
    });

    // Re-initialize embed when calLink changes after script is loaded
    effect(() => {
      const link = this.calLink();
      if (this.scriptLoaded) {
        this.clearEmbed();
        this.initCal(link);
      }
    });
  }

  private loadCalScript(): void {
    const calFn = this.getCalFunction();
    if (calFn) {
      this.scriptLoaded = true;
      this.loaded.set(true);
      this.initCal(this.calLink());
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;

    script.onload = () => {
      this.scriptLoaded = true;
      this.loaded.set(true);
      this.initCal(this.calLink());
    };

    script.onerror = () => {
      this.error.set(true);
    };

    document.head.appendChild(script);
    this.destroyRef.onDestroy(() => script.remove());

    // Timeout fallback in case script hangs
    const timeout = setTimeout(() => {
      if (!this.loaded() && !this.error()) {
        this.error.set(true);
      }
    }, 10_000);

    this.destroyRef.onDestroy(() => clearTimeout(timeout));
  }

  private initCal(calLink: string): void {
    const Cal = this.getCalFunction();
    if (Cal) {
      Cal('init', { origin: 'https://app.cal.com' });
      Cal('inline', {
        elementOrSelector: '#cal-embed',
        calLink,
        layout: 'month_view',
      });
    }
  }

  private clearEmbed(): void {
    const el = document.getElementById('cal-embed');
    if (el) {
      el.innerHTML = '';
    }
  }

  private getCalFunction(): CalFunction | undefined {
    const calFn = (window as unknown as Record<string, unknown>)['Cal'];
    return typeof calFn === 'function' ? (calFn as CalFunction) : undefined;
  }
}
