import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TimelineComponent } from './timeline.component';
import { Experience } from '@models/index';

const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'tcsLead',
    titleKey: 'experience.tcsLead.title',
    companyKey: 'experience.tcsLead.company',
    periodKey: 'experience.tcsLead.period',
    descriptionKey: 'experience.tcsLead.description',
    tags: ['Angular', 'TypeScript'],
  },
  {
    id: 'tcsDev',
    titleKey: 'experience.tcsDev.title',
    companyKey: 'experience.tcsDev.company',
    periodKey: 'experience.tcsDev.period',
    descriptionKey: 'experience.tcsDev.description',
    tags: ['Node.js', 'Docker'],
  },
];

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

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
      imports: [TimelineComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('experiences', MOCK_EXPERIENCES);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all timeline items', () => {
    const items = fixture.nativeElement.querySelectorAll(
      '.timeline__item',
    ) as NodeListOf<HTMLElement>;
    expect(items.length).toBe(2);
  });

  it('should alternate left and right on desktop', () => {
    const items = fixture.nativeElement.querySelectorAll(
      '.timeline__item',
    ) as NodeListOf<HTMLElement>;
    expect(items[0].classList.contains('timeline__item--right')).toBe(false);
    expect(items[1].classList.contains('timeline__item--right')).toBe(true);
  });

  it('should render job titles', () => {
    const titles = fixture.nativeElement.querySelectorAll(
      '.timeline__title',
    ) as NodeListOf<HTMLElement>;
    expect(titles[0].textContent?.trim()).toBe('Technical Lead');
    expect(titles[1].textContent?.trim()).toBe('Developer');
  });

  it('should render company names', () => {
    const companies = fixture.nativeElement.querySelectorAll(
      '.timeline__company',
    ) as NodeListOf<HTMLElement>;
    expect(companies[0].textContent?.trim()).toBe('Tata Consultancy Services TCS');
  });

  it('should render period badges', () => {
    const periods = fixture.nativeElement.querySelectorAll(
      '.timeline__period',
    ) as NodeListOf<HTMLElement>;
    expect(periods[0].textContent?.trim()).toBe('2025 — Present');
  });

  it('should render tags for each experience', () => {
    const firstItem = fixture.nativeElement.querySelector('.timeline__item') as HTMLElement;
    const tags = firstItem.querySelectorAll('.timeline__tag') as NodeListOf<HTMLElement>;
    expect(tags.length).toBe(2);
    expect(tags[0].textContent?.trim()).toBe('Angular');
    expect(tags[1].textContent?.trim()).toBe('TypeScript');
  });

  it('should render descriptions', () => {
    const descriptions = fixture.nativeElement.querySelectorAll(
      '.timeline__description',
    ) as NodeListOf<HTMLElement>;
    expect(descriptions[0].textContent?.trim()).toContain('Leading a team');
  });
});
