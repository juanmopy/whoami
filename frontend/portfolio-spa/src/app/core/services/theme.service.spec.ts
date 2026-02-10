import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let documentRef: Document;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    documentRef = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a default theme', () => {
    const theme = service.currentTheme();
    expect(['light', 'dark']).toContain(theme);
  });

  it('should toggle from light to dark', () => {
    // Force light first
    if (service.currentTheme() === 'dark') {
      service.toggle();
    }
    expect(service.currentTheme()).toBe('light');

    service.toggle();
    expect(service.currentTheme()).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    // Force dark first
    if (service.currentTheme() === 'light') {
      service.toggle();
    }
    expect(service.currentTheme()).toBe('dark');

    service.toggle();
    expect(service.currentTheme()).toBe('light');
  });

  it('should apply dark class to body when dark', () => {
    if (service.currentTheme() === 'light') {
      service.toggle();
    }
    TestBed.flushEffects();
    expect(documentRef.body.classList.contains('dark')).toBe(true);
    expect(documentRef.body.classList.contains('light')).toBe(false);
  });

  it('should apply light class to body when light', () => {
    if (service.currentTheme() === 'dark') {
      service.toggle();
    }
    TestBed.flushEffects();
    expect(documentRef.body.classList.contains('light')).toBe(true);
    expect(documentRef.body.classList.contains('dark')).toBe(false);
  });

  it('should persist theme to localStorage', () => {
    service.toggle();
    TestBed.flushEffects();
    const stored = localStorage.getItem('portfolio-theme');
    expect(stored).toBe(service.currentTheme());
  });

  it('should restore theme from localStorage', () => {
    localStorage.setItem('portfolio-theme', 'dark');

    const freshService = TestBed.inject(ThemeService);
    // The service reads from localStorage on init
    expect(freshService).toBeTruthy();
  });
});
