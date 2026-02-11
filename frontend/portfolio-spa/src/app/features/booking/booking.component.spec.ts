import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { BookingComponent } from './booking.component';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

    class MockIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });

    TestBed.configureTestingModule({
      imports: [BookingComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const title = fixture.nativeElement.querySelector('.booking__title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Book a Meeting');
  });

  it('should render two meeting type options', () => {
    const options = fixture.nativeElement.querySelectorAll(
      '.booking__option',
    ) as NodeListOf<HTMLElement>;
    expect(options.length).toBe(2);
  });

  it('should display Intro option', () => {
    const titles = fixture.nativeElement.querySelectorAll(
      '.booking__option-title',
    ) as NodeListOf<HTMLElement>;
    expect(titles[0].textContent?.trim()).toBe('Intro');
  });

  it('should display Consultoría option', () => {
    const titles = fixture.nativeElement.querySelectorAll(
      '.booking__option-title',
    ) as NodeListOf<HTMLElement>;
    expect(titles[1].textContent?.trim()).toBe('Consulting');
  });

  it('should have Intro selected by default', () => {
    const selected = fixture.nativeElement.querySelector(
      '.booking__option--selected',
    ) as HTMLElement;
    expect(selected).toBeTruthy();
    expect(selected.querySelector('.booking__option-title')?.textContent?.trim()).toBe('Intro');
  });

  it('should select Consultoría when clicked', () => {
    const options = fixture.nativeElement.querySelectorAll(
      '.booking__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click();
    fixture.detectChanges();

    const selected = fixture.nativeElement.querySelector(
      '.booking__option--selected',
    ) as HTMLElement;
    expect(selected.querySelector('.booking__option-title')?.textContent?.trim()).toBe(
      'Consulting',
    );
  });

  it('should update selected type when clicked', () => {
    expect(component['selectedType']().calLink).toBe('juanmopy/30min');

    const options = fixture.nativeElement.querySelectorAll(
      '.booking__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click();
    fixture.detectChanges();

    expect(component['selectedType']().calLink).toBe('juanmopy/60min');
  });

  it('should have data-cal-link on options', () => {
    const options = fixture.nativeElement.querySelectorAll(
      '.booking__option',
    ) as NodeListOf<HTMLButtonElement>;
    expect(options[0].getAttribute('data-cal-link')).toBe('juanmopy/30min');
    expect(options[1].getAttribute('data-cal-link')).toBe('juanmopy/60min');
  });

  it('should have data-cal-namespace on options', () => {
    const options = fixture.nativeElement.querySelectorAll(
      '.booking__option',
    ) as NodeListOf<HTMLButtonElement>;
    expect(options[0].getAttribute('data-cal-namespace')).toBe('30min');
    expect(options[1].getAttribute('data-cal-namespace')).toBe('60min');
  });

  it('should have data-cal-config on options', () => {
    const option = fixture.nativeElement.querySelector('.booking__option') as HTMLButtonElement;
    const config = JSON.parse(option.getAttribute('data-cal-config') ?? '{}');
    expect(config.layout).toBe('month_view');
  });
});
