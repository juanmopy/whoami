import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(I18nService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    // Flush the initial language load
    const req = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    req.flush({});
    expect(service).toBeTruthy();
  });

  it('should detect default language', () => {
    const req = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    req.flush({});
    expect(['en', 'es']).toContain(service.currentLang());
  });

  it('should load translations on init', () => {
    const mockTranslations = { nav: { home: 'Inicio' } };
    const req = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    req.flush(mockTranslations);

    expect(service.loaded()).toBe(true);
  });

  it('should translate nested keys', () => {
    const mockTranslations = { nav: { home: 'Inicio' } };
    const req = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    req.flush(mockTranslations);

    expect(service.translate('nav.home')).toBe('Inicio');
  });

  it('should return key for missing translation', () => {
    const req = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    req.flush({});

    expect(service.translate('missing.key')).toBe('missing.key');
  });

  it('should switch language', () => {
    // Flush initial load
    const initialReq = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    initialReq.flush({});

    service.setLanguage('en');

    const req = httpController.expectOne('assets/i18n/en.json');
    req.flush({ nav: { home: 'Home' } });

    expect(service.currentLang()).toBe('en');
    expect(service.translate('nav.home')).toBe('Home');
  });

  it('should toggle language', () => {
    // Flush initial load
    const initialReq = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    initialReq.flush({});

    const initialLang = service.currentLang();
    service.toggleLanguage();

    const expectedLang = initialLang === 'es' ? 'en' : 'es';
    const req = httpController.expectOne(`assets/i18n/${expectedLang}.json`);
    req.flush({});

    expect(service.currentLang()).toBe(expectedLang);
  });

  it('should handle HTTP errors gracefully', () => {
    const req = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    req.error(new ProgressEvent('error'));

    expect(service.loaded()).toBe(true);
    expect(service.translate('any.key')).toBe('any.key');
  });

  it('should persist language in localStorage', () => {
    // Flush initial load
    const initialReq = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    initialReq.flush({});

    service.setLanguage('en');

    const req = httpController.expectOne('assets/i18n/en.json');
    req.flush({});

    expect(localStorage.getItem('portfolio-lang')).toBe('en');
  });

  it('should not set unsupported language', () => {
    const initialReq = httpController.expectOne((r) => r.url.startsWith('assets/i18n/'));
    initialReq.flush({});

    const currentLang = service.currentLang();
    service.setLanguage('fr' as 'en');

    expect(service.currentLang()).toBe(currentLang);
  });
});
