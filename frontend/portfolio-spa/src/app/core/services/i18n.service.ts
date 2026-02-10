import { Injectable, inject, signal, computed, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Language = 'en' | 'es';

interface TranslationMap {
  [key: string]: string | TranslationMap;
}

const SUPPORTED_LANGUAGES: Language[] = ['en', 'es'];
const DEFAULT_LANGUAGE: Language = 'es';
const STORAGE_KEY = 'portfolio-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _currentLang = signal<Language>(this.detectLanguage());
  private readonly _translations = signal<TranslationMap>({});
  private readonly _loaded = signal(false);

  readonly currentLang = this._currentLang.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly isSpanish = computed(() => this._currentLang() === 'es');

  constructor() {
    this.loadTranslations(this._currentLang());
  }

  setLanguage(lang: Language): void {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;

    this._currentLang.set(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }

    this.loadTranslations(lang);
  }

  toggleLanguage(): void {
    const next = this._currentLang() === 'es' ? 'en' : 'es';
    this.setLanguage(next);
  }

  translate(key: string): string {
    const parts = key.split('.');
    let result: string | TranslationMap = this._translations();

    for (const part of parts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        return key;
      }
    }

    return typeof result === 'string' ? result : key;
  }

  private detectLanguage(): Language {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;

      const browserLang = navigator.language.split('-')[0] as Language;
      if (SUPPORTED_LANGUAGES.includes(browserLang)) return browserLang;
    }

    return DEFAULT_LANGUAGE;
  }

  private loadTranslations(lang: Language): void {
    this.http
      .get<TranslationMap>(`assets/i18n/${lang}.json`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (translations) => {
          this._translations.set(translations);
          this._loaded.set(true);
        },
        error: () => {
          this._translations.set({});
          this._loaded.set(true);
        },
      });
  }
}
