import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { CalendarEmbedComponent } from './calendar-embed.component';

describe('CalendarEmbedComponent', () => {
  let component: CalendarEmbedComponent;
  let fixture: ComponentFixture<CalendarEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalendarEmbedComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    fixture = TestBed.createComponent(CalendarEmbedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should use default calLink', () => {
    fixture.detectChanges();
    expect(component.calLink()).toBe('juanmopy/30min');
  });

  it('should compute fallback URL', () => {
    fixture.detectChanges();
    expect(component['fallbackUrl']).toBe('https://cal.com/juanmopy/30min');
  });

  it('should show loading state initially', () => {
    fixture.detectChanges();
    const loading = fixture.nativeElement.querySelector('.calendar-embed__loading') as HTMLElement;
    expect(loading).toBeTruthy();
  });

  it('should show fallback on error', () => {
    fixture.detectChanges();
    component['error'].set(true);
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector(
      '.calendar-embed__fallback',
    ) as HTMLElement;
    expect(fallback).toBeTruthy();
  });

  it('should render fallback link with correct href', () => {
    fixture.detectChanges();
    component['error'].set(true);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      '.calendar-embed__fallback-link',
    ) as HTMLAnchorElement;
    expect(link.href).toBe('https://cal.com/juanmopy/30min');
    expect(link.rel).toBe('noopener noreferrer');
    expect(link.target).toBe('_blank');
  });

  it('should not load script on server platform', () => {
    fixture.destroy();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CalendarEmbedComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    const serverFixture = TestBed.createComponent(CalendarEmbedComponent);
    const serverComponent = serverFixture.componentInstance;
    serverFixture.detectChanges();

    expect(serverComponent['loaded']()).toBe(false);
    expect(serverComponent['error']()).toBe(false);

    serverFixture.destroy();
  });

  it('should set data-cal-link attribute', () => {
    fixture.detectChanges();
    const embed = fixture.nativeElement.querySelector('#cal-embed') as HTMLElement;
    expect(embed?.getAttribute('data-cal-link')).toBe('juanmopy/30min');
  });
});
