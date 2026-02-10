import { DOCUMENT } from '@angular/common';
import { Injectable, Signal, effect, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';

const THEME_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly theme = signal<Theme>(this.getInitialTheme());

  readonly currentTheme: Signal<Theme> = this.theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.applyTheme(theme);
      this.persistTheme(theme);
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): Theme {
    const stored = this.getStoredTheme();
    if (stored) {
      return stored;
    }
    return this.getSystemPreference();
  }

  private getStoredTheme(): Theme | null {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // localStorage not available (SSR)
    }
    return null;
  }

  private getSystemPreference(): Theme {
    try {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch {
      // matchMedia not available (SSR)
      return 'light';
    }
  }

  private applyTheme(theme: Theme): void {
    const body = this.document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }

  private persistTheme(theme: Theme): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage not available (SSR)
    }
  }
}
