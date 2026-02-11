import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});

    service = TestBed.inject(I18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect default language', () => {
    expect(['en', 'es']).toContain(service.currentLang());
  });

  it('should have translations loaded on init', () => {
    expect(service.loaded()).toBe(true);
  });

  it('should translate nested keys', () => {
    expect(service.translate('nav.home')).toBeTruthy();
    expect(service.translate('nav.home')).not.toBe('nav.home');
  });

  it('should return key for missing translation', () => {
    expect(service.translate('missing.key')).toBe('missing.key');
  });

  it('should switch language', () => {
    service.setLanguage('en');

    expect(service.currentLang()).toBe('en');
    expect(service.translate('nav.home')).toBe('Home');
  });

  it('should toggle language', () => {
    const initialLang = service.currentLang();
    service.toggleLanguage();

    const expectedLang = initialLang === 'es' ? 'en' : 'es';
    expect(service.currentLang()).toBe(expectedLang);
  });

  it('should persist language in localStorage', () => {
    service.setLanguage('en');
    expect(localStorage.getItem('portfolio-lang')).toBe('en');
  });

  it('should not set unsupported language', () => {
    const currentLang = service.currentLang();
    service.setLanguage('fr' as 'en');
    expect(service.currentLang()).toBe(currentLang);
  });

  it('should compute isSpanish correctly', () => {
    service.setLanguage('es');
    expect(service.isSpanish()).toBe(true);

    service.setLanguage('en');
    expect(service.isSpanish()).toBe(false);
  });
});
