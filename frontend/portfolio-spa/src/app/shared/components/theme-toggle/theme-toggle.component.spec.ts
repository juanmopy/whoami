import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '@core/services/theme.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  const themeSignal = signal<'light' | 'dark'>('light');
  const toggleFn = vi.fn();

  const themeServiceMock = {
    toggle: toggleFn,
    currentTheme: themeSignal.asReadonly(),
  };

  beforeEach(async () => {
    toggleFn.mockClear();

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should show moon icon in light mode', () => {
    themeSignal.set('light');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg path');
    expect(svg).toBeTruthy();
  });

  it('should show sun icon in dark mode', () => {
    themeSignal.set('dark');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg circle');
    expect(svg).toBeTruthy();
  });

  it('should call toggle on click', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(toggleFn).toHaveBeenCalled();
  });

  it('should have correct aria-label for light mode', () => {
    themeSignal.set('light');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('common.darkMode');
  });

  it('should have correct aria-label for dark mode', () => {
    themeSignal.set('dark');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('common.lightMode');
  });
});
