import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import esTranslations from '../../../assets/i18n/es.json';
import enTranslations from '../../../assets/i18n/en.json';

type Language = 'en' | 'es';

interface TranslationMap {
  [key: string]: string | TranslationMap;
}

const SUPPORTED_LANGUAGES: Language[] = ['en', 'es'];
const DEFAULT_LANGUAGE: Language = 'es';
const STORAGE_KEY = 'portfolio-lang';

const TRANSLATIONS: Record<Language, TranslationMap> = {
  es: esTranslations as unknown as TranslationMap,
  en: enTranslations as unknown as TranslationMap,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _currentLang = signal<Language>(this.detectLanguage());
  private readonly _translations = signal<TranslationMap>(TRANSLATIONS[this.detectLanguage()]);
  private readonly _loaded = signal(true);

  readonly currentLang = this._currentLang.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly isSpanish = computed(() => this._currentLang() === 'es');

  setLanguage(lang: Language): void {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;

    this._currentLang.set(lang);
    this._translations.set(TRANSLATIONS[lang]);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
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
}
