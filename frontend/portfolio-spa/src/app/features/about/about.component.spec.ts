import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AboutComponent } from './about.component';
import { SkillCategory } from '@models/index';
import { Experience } from '@models/index';

const MOCK_SKILLS: SkillCategory[] = [
  {
    category: 'Frontend',
    items: [{ name: 'Angular', level: 90 }],
  },
];

const MOCK_EXPERIENCES: Experience[] = [
  {
    title: 'Senior Dev',
    company: 'Corp',
    period: '2022 — Present',
    description: 'Leading projects.',
    tags: ['Angular'],
  },
];

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let httpTesting: HttpTestingController;

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
      imports: [AboutComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    fixture?.destroy();
    try {
      httpTesting.verify();
    } catch {
      // Ignore verification errors during cleanup
    }
    vi.restoreAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    httpTesting.expectOne('assets/data/experience.json').flush(MOCK_EXPERIENCES);
    expect(component).toBeTruthy();
  });

  it('should load skills from JSON', () => {
    fixture.detectChanges();

    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    httpTesting.expectOne('assets/data/experience.json').flush(MOCK_EXPERIENCES);
    fixture.detectChanges();

    expect(component['skills']()).toEqual(MOCK_SKILLS);
  });

  it('should load experiences from JSON', () => {
    fixture.detectChanges();

    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    httpTesting.expectOne('assets/data/experience.json').flush(MOCK_EXPERIENCES);
    fixture.detectChanges();

    expect(component['experiences']()).toEqual(MOCK_EXPERIENCES);
  });

  it('should render section title', () => {
    fixture.detectChanges();
    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    httpTesting.expectOne('assets/data/experience.json').flush(MOCK_EXPERIENCES);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.about__title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Sobre Mí');
  });

  it('should render skill-bar component when skills loaded', () => {
    fixture.detectChanges();
    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    httpTesting.expectOne('assets/data/experience.json').flush(MOCK_EXPERIENCES);
    fixture.detectChanges();

    const skillBar = fixture.nativeElement.querySelector('app-skill-bar');
    expect(skillBar).toBeTruthy();
  });

  it('should render timeline component when experiences loaded', () => {
    fixture.detectChanges();
    httpTesting.expectOne('assets/data/skills.json').flush(MOCK_SKILLS);
    httpTesting.expectOne('assets/data/experience.json').flush(MOCK_EXPERIENCES);
    fixture.detectChanges();

    const timeline = fixture.nativeElement.querySelector('app-timeline');
    expect(timeline).toBeTruthy();
  });

  it('should not render skill-bar when no skills', () => {
    fixture.detectChanges();
    httpTesting.expectOne('assets/data/skills.json').flush([]);
    httpTesting.expectOne('assets/data/experience.json').flush([]);
    fixture.detectChanges();

    const skillBar = fixture.nativeElement.querySelector('app-skill-bar');
    expect(skillBar).toBeNull();
  });

  it('should not render timeline when no experiences', () => {
    fixture.detectChanges();
    httpTesting.expectOne('assets/data/skills.json').flush([]);
    httpTesting.expectOne('assets/data/experience.json').flush([]);
    fixture.detectChanges();

    const timeline = fixture.nativeElement.querySelector('app-timeline');
    expect(timeline).toBeNull();
  });
});
