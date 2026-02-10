import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appAnimateOnScroll]',
  host: {
    '[class.aos--visible]': 'isVisible()',
    '[class.aos--hidden]': '!isVisible()',
  },
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  readonly aosThreshold = input<number>(0.1);
  readonly aosRootMargin = input('0px');

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isVisible = signal(false);
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isVisible.set(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.isVisible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible.set(true);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.aosThreshold(),
        rootMargin: this.aosRootMargin(),
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
