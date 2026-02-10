import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { SkillBarComponent } from './skill-bar.component';
import { SkillCategory } from '@models/index';

const MOCK_CATEGORIES: SkillCategory[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'Angular', level: 90 },
      { name: 'TypeScript', level: 85 },
    ],
  },
  {
    category: 'Backend',
    items: [{ name: 'Node.js', level: 80 }],
  },
];

describe('SkillBarComponent', () => {
  let component: SkillBarComponent;
  let fixture: ComponentFixture<SkillBarComponent>;

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
      imports: [SkillBarComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    fixture = TestBed.createComponent(SkillBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', MOCK_CATEGORIES);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render category titles', () => {
    const titles = fixture.nativeElement.querySelectorAll(
      '.skills__category-title',
    ) as NodeListOf<HTMLElement>;
    expect(titles.length).toBe(2);
    expect(titles[0].textContent?.trim()).toBe('Frontend');
    expect(titles[1].textContent?.trim()).toBe('Backend');
  });

  it('should render all skill items', () => {
    const items = fixture.nativeElement.querySelectorAll(
      '.skills__item',
    ) as NodeListOf<HTMLElement>;
    expect(items.length).toBe(3);
  });

  it('should render skill names', () => {
    const names = fixture.nativeElement.querySelectorAll(
      '.skills__item-name',
    ) as NodeListOf<HTMLElement>;
    expect(names[0].textContent?.trim()).toBe('Angular');
    expect(names[1].textContent?.trim()).toBe('TypeScript');
    expect(names[2].textContent?.trim()).toBe('Node.js');
  });

  it('should render skill levels as percentages', () => {
    const levels = fixture.nativeElement.querySelectorAll(
      '.skills__item-level',
    ) as NodeListOf<HTMLElement>;
    expect(levels[0].textContent?.trim()).toBe('90%');
    expect(levels[1].textContent?.trim()).toBe('85%');
  });

  it('should set correct width on bar fill', () => {
    const fills = fixture.nativeElement.querySelectorAll(
      '.skills__bar-fill',
    ) as NodeListOf<HTMLElement>;
    expect(fills[0].style.width).toBe('90%');
  });

  it('should have progressbar role with correct aria attributes', () => {
    const bars = fixture.nativeElement.querySelectorAll('.skills__bar') as NodeListOf<HTMLElement>;
    expect(bars[0].getAttribute('role')).toBe('progressbar');
    expect(bars[0].getAttribute('aria-valuenow')).toBe('90');
    expect(bars[0].getAttribute('aria-valuemin')).toBe('0');
    expect(bars[0].getAttribute('aria-valuemax')).toBe('100');
  });
});
