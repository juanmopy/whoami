import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, PLATFORM_ID } from '@angular/core';
import { AnimateOnScrollDirective } from './animate-on-scroll.directive';

@Component({
  template: `<div appAnimateOnScroll>Test</div>`,
  imports: [AnimateOnScrollDirective],
})
class TestHostComponent {}

describe('AnimateOnScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    mockUnobserve = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = mockUnobserve;
      root = null;
      rootMargin = '0px';
      thresholds = [0.1];
      takeRecords = vi.fn();
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  function createDirective(platformId = 'browser'): void {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: platformId }],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  }

  it('should create the directive', () => {
    createDirective();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should observe the element on init', () => {
    createDirective();
    expect(mockObserve).toHaveBeenCalled();
  });

  it('should add aos--hidden class initially', () => {
    createDirective();
    const el = fixture.nativeElement.querySelector('[appanimateonscroll]') as HTMLElement;
    expect(el.classList.contains('aos--hidden')).toBe(true);
  });

  it('should add aos--visible class when element intersects', () => {
    createDirective();
    const el = fixture.nativeElement.querySelector('[appanimateonscroll]') as HTMLElement;

    intersectionCallback(
      [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    fixture.detectChanges();

    expect(el.classList.contains('aos--visible')).toBe(true);
  });

  it('should unobserve after becoming visible', () => {
    createDirective();
    const el = fixture.nativeElement.querySelector('[appanimateonscroll]') as HTMLElement;

    intersectionCallback(
      [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(mockUnobserve).toHaveBeenCalledWith(el);
  });

  it('should disconnect observer on destroy', () => {
    createDirective();
    fixture.destroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should set visible immediately on server platform', () => {
    createDirective('server');
    const el = fixture.nativeElement.querySelector('[appanimateonscroll]') as HTMLElement;
    expect(el.classList.contains('aos--visible')).toBe(true);
  });

  it('should set visible immediately when prefers-reduced-motion is true', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    createDirective();
    const el = fixture.nativeElement.querySelector('[appanimateonscroll]') as HTMLElement;
    expect(el.classList.contains('aos--visible')).toBe(true);
    expect(mockObserve).not.toHaveBeenCalled();
  });
});
