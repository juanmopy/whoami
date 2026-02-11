import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Renderer2,
  PLATFORM_ID,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-calendar-embed',
  templateUrl: './calendar-embed.component.html',
  styleUrl: './calendar-embed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEmbedComponent implements AfterViewInit {
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly calLink = input('juanmopy/30min');

  protected readonly loaded = signal(false);
  protected readonly error = signal(false);

  protected readonly embedContainer = viewChild<ElementRef<HTMLDivElement>>('embedContainer');

  protected get fallbackUrl(): string {
    return `https://cal.com/${this.calLink()}`;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadCalScript();
  }

  private loadCalScript(): void {
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;

    script.onload = () => {
      this.loaded.set(true);
      this.initCal();
    };

    script.onerror = () => {
      this.error.set(true);
    };

    this.renderer.appendChild(document.head, script);

    this.destroyRef.onDestroy(() => {
      script.remove();
    });

    // Timeout fallback in case script hangs
    const timeout = setTimeout(() => {
      if (!this.loaded() && !this.error()) {
        this.error.set(true);
      }
    }, 10_000);

    this.destroyRef.onDestroy(() => clearTimeout(timeout));
  }

  private initCal(): void {
    const calWindow = window as unknown as Record<string, unknown>;
    if (typeof calWindow['Cal'] === 'function') {
      (calWindow['Cal'] as (action: string, config: Record<string, unknown>) => void)('init', {
        origin: 'https://cal.com',
      });
      (calWindow['Cal'] as (action: string, link: string, config: Record<string, unknown>) => void)(
        'inline',
        this.calLink(),
        { elementOrSelector: '#cal-embed' },
      );
    }
  }
}
