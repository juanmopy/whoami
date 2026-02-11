import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarEmbedComponent } from './calendar-embed.component';

describe('CalendarEmbedComponent', () => {
  let component: CalendarEmbedComponent;
  let fixture: ComponentFixture<CalendarEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalendarEmbedComponent],
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

  it('should not have script loaded initially', () => {
    fixture.detectChanges();
    expect(component['loaded']()).toBe(false);
    expect(component['error']()).toBe(false);
  });

  it('should set data-cal-link attribute', () => {
    fixture.detectChanges();
    const embed = fixture.nativeElement.querySelector('#cal-embed') as HTMLElement;
    expect(embed?.getAttribute('data-cal-link')).toBe('juanmopy/30min');
  });
});
