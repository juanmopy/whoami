import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HeroComponent } from './hero.component';

function createMatchMediaMock(matches = false): MediaQueryList {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  } as unknown as MediaQueryList;
}

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let matchMediaMock: ReturnType<typeof vi.fn>;

  function createComponent(platformId = 'browser'): void {
    TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [{ provide: PLATFORM_ID, useValue: platformId }, provideRouter([])],
    });

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    matchMediaMock = vi.fn().mockReturnValue(createMatchMediaMock(false));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('creation', () => {
    it('should create', () => {
      createComponent();
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should render profile image with eager loading', () => {
      const img = fixture.nativeElement.querySelector('.hero__photo') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.getAttribute('loading')).toBe('eager');
      expect(img.getAttribute('fetchpriority')).toBe('high');
    });

    it('should render the name heading', () => {
      const h1 = fixture.nativeElement.querySelector('.hero__name') as HTMLElement;
      expect(h1).toBeTruthy();
      expect(h1.textContent?.trim()).toBe('Tu Nombre');
    });

    it('should render CTA buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll(
        '.hero__btn',
      ) as NodeListOf<HTMLElement>;
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent?.trim()).toBe('Ver Proyectos');
      expect(buttons[1].textContent?.trim()).toBe('Contactar');
    });

    it('should render scroll indicator with aria-label', () => {
      const scrollBtn = fixture.nativeElement.querySelector(
        '.hero__scroll-indicator',
      ) as HTMLElement;
      expect(scrollBtn).toBeTruthy();
      expect(scrollBtn.getAttribute('aria-label')).toBe('Scroll to next section');
    });

    it('should render 6 particle elements', () => {
      const particles = fixture.nativeElement.querySelectorAll(
        '.hero__particle',
      ) as NodeListOf<HTMLElement>;
      expect(particles.length).toBe(6);
    });

    it('should have aria-live on tagline container', () => {
      const tagline = fixture.nativeElement.querySelector('.hero__tagline') as HTMLElement;
      expect(tagline.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('typed effect', () => {
    it('should set initial display text on SSR (server platform)', () => {
      createComponent('server');
      fixture.detectChanges();

      expect(component['displayText']()).toBe('Full Stack Developer');
    });

    it('should start typing effect on browser platform', () => {
      vi.useFakeTimers();
      createComponent();
      fixture.detectChanges();

      // After init delay (500ms) + some typing ticks
      vi.advanceTimersByTime(500 + 80 * 5);
      fixture.detectChanges();

      const text = component['displayText']();
      expect(text.length).toBeGreaterThan(0);
      expect('Full Stack Developer'.startsWith(text)).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('reduced motion', () => {
    it('should set full text immediately when prefers-reduced-motion is true', () => {
      matchMediaMock.mockReturnValue(createMatchMediaMock(true));

      createComponent();
      fixture.detectChanges();

      expect(component['displayText']()).toBe('Full Stack Developer');
      expect(component['prefersReducedMotion']()).toBe(true);
    });

    it('should add static class to particles when reduced motion', () => {
      matchMediaMock.mockReturnValue(createMatchMediaMock(true));

      createComponent();
      fixture.detectChanges();

      const staticParticles = fixture.nativeElement.querySelectorAll(
        '.hero__particle--static',
      ) as NodeListOf<HTMLElement>;
      expect(staticParticles.length).toBe(6);
    });
  });

  describe('scroll interactions', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should have Ver Proyectos link to /portfolio', () => {
      const link = fixture.nativeElement.querySelector('.hero__btn--primary') as HTMLAnchorElement;
      expect(link.getAttribute('href')).toBe('/portfolio');
    });

    it('should have Contactar link to /contact', () => {
      const link = fixture.nativeElement.querySelector(
        '.hero__btn--secondary',
      ) as HTMLAnchorElement;
      expect(link.getAttribute('href')).toBe('/contact');
    });

    it('should scroll down on scroll indicator click', () => {
      const scrollToSpy = vi.fn();
      Object.defineProperty(window, 'scrollTo', {
        value: scrollToSpy,
        writable: true,
        configurable: true,
      });

      const scrollBtn = fixture.nativeElement.querySelector(
        '.hero__scroll-indicator',
      ) as HTMLElement;
      scrollBtn.click();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: window.innerHeight, behavior: 'smooth' });
    });
  });

  describe('cursor blink', () => {
    it('should toggle cursor visibility', () => {
      vi.useFakeTimers();
      createComponent();
      fixture.detectChanges();

      const initial = component['showCursor']();
      vi.advanceTimersByTime(530);
      fixture.detectChanges();

      expect(component['showCursor']()).toBe(!initial);

      vi.useRealTimers();
    });
  });
});
