import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { I18nService } from '@core/services/i18n.service';

@Component({
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <span id="home">{{ 'nav.home' | translate }}</span>
    <span id="about">{{ 'nav.about' | translate }}</span>
    <span id="missing">{{ 'missing.key' | translate }}</span>
  `,
})
class TestHostComponent {}

describe('TranslatePipe', () => {
  let mockI18nService: { translate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockI18nService = {
      translate: vi.fn((key: string) => {
        const translations: Record<string, string> = {
          'nav.home': 'Inicio',
          'nav.about': 'Sobre Mí',
        };
        return translations[key] ?? key;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: I18nService, useValue: mockI18nService }],
    }).compileComponents();
  });

  it('should render translated text in template', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('#home');
    expect(span.textContent).toBe('Inicio');
  });

  it('should translate different keys', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('#about');
    expect(span.textContent).toBe('Sobre Mí');
  });

  it('should return key for missing translation', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('#missing');
    expect(span.textContent).toBe('missing.key');
  });

  it('should call i18n service translate method', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(mockI18nService.translate).toHaveBeenCalledWith('nav.home');
    expect(mockI18nService.translate).toHaveBeenCalledWith('nav.about');
    expect(mockI18nService.translate).toHaveBeenCalledWith('missing.key');
  });
});
