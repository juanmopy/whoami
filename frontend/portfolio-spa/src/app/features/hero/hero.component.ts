import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

const TAGLINES: readonly string[] = [
  'Full Stack Developer',
  'Angular Specialist',
  'Cloud Architect',
  'Open Source Contributor',
];

const TYPING_SPEED_MS = 80;
const DELETING_SPEED_MS = 40;
const PAUSE_BEFORE_DELETE_MS = 2000;
const PAUSE_BEFORE_TYPE_MS = 500;

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollIndicator = viewChild<ElementRef<HTMLElement>>('scrollIndicator');

  protected readonly displayText = signal('');
  protected readonly showCursor = signal(true);
  protected readonly prefersReducedMotion = signal(false);

  private taglineIndex = 0;
  private charIndex = 0;
  private isDeleting = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion.set(mediaQuery.matches);

      if (this.prefersReducedMotion()) {
        this.displayText.set(TAGLINES[0]);
        return;
      }

      this.startTypingEffect();
    } else {
      this.displayText.set(TAGLINES[0]);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startCursorBlink();
    }
  }

  protected scrollDown(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  }

  private startTypingEffect(): void {
    const tick = (): void => {
      const currentTagline = TAGLINES[this.taglineIndex];

      if (!this.isDeleting) {
        this.charIndex++;
        this.displayText.set(currentTagline.substring(0, this.charIndex));

        if (this.charIndex === currentTagline.length) {
          this.isDeleting = true;
          setTimeout(tick, PAUSE_BEFORE_DELETE_MS);
          return;
        }

        setTimeout(tick, TYPING_SPEED_MS);
      } else {
        this.charIndex--;
        this.displayText.set(currentTagline.substring(0, this.charIndex));

        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.taglineIndex = (this.taglineIndex + 1) % TAGLINES.length;
          setTimeout(tick, PAUSE_BEFORE_TYPE_MS);
          return;
        }

        setTimeout(tick, DELETING_SPEED_MS);
      }
    };

    setTimeout(tick, PAUSE_BEFORE_TYPE_MS);
  }

  private startCursorBlink(): void {
    interval(530)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showCursor.update((v) => !v);
      });
  }
}
