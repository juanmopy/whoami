import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { PortfolioComponent } from './portfolio.component';
import { Project } from '@models/index';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Project One',
    description: 'First project.',
    image: 'img1.webp',
    tags: ['Angular', 'TypeScript'],
    demoUrl: 'https://demo1.com',
    repoUrl: 'https://repo1.com',
    featured: true,
  },
  {
    id: '2',
    title: 'Project Two',
    description: 'Second project.',
    image: 'img2.webp',
    tags: ['Node.js', 'Docker'],
    featured: false,
  },
  {
    id: '3',
    title: 'Project Three',
    description: 'Third project.',
    image: 'img3.webp',
    tags: ['Angular', 'Docker'],
    featured: true,
  },
];

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
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
      imports: [PortfolioComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    fixture = TestBed.createComponent(PortfolioComponent);
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

  function loadProjects(projects: Project[] = MOCK_PROJECTS): void {
    fixture.detectChanges();
    httpTesting.expectOne('assets/data/projects.json').flush(projects);
    fixture.detectChanges();
  }

  it('should create', () => {
    loadProjects();
    expect(component).toBeTruthy();
  });

  it('should load projects from JSON', () => {
    loadProjects();
    expect(component['projects']().length).toBe(3);
  });

  it('should extract unique tags', () => {
    loadProjects();
    const tags = component['allTags']();
    expect(tags).toContain('Angular');
    expect(tags).toContain('Node.js');
    expect(tags).toContain('Docker');
    expect(tags).toContain('TypeScript');
    expect(tags.length).toBe(4);
  });

  it('should render project cards', () => {
    loadProjects();
    const cards = fixture.nativeElement.querySelectorAll(
      'app-project-card',
    ) as NodeListOf<HTMLElement>;
    expect(cards.length).toBe(3);
  });

  it('should render filter component', () => {
    loadProjects();
    const filter = fixture.nativeElement.querySelector('app-project-filter');
    expect(filter).toBeTruthy();
  });

  it('should filter projects by selected tags', () => {
    loadProjects();

    component['onFilterChange'](['Node.js']);
    fixture.detectChanges();

    const filtered = component['filteredProjects']();
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Project Two');
  });

  it('should show all projects when no filter selected', () => {
    loadProjects();

    component['onFilterChange']([]);
    fixture.detectChanges();

    expect(component['filteredProjects']().length).toBe(3);
  });

  it('should show empty message when no projects match filter', () => {
    loadProjects();

    component['onFilterChange'](['Python']);
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.portfolio__empty') as HTMLElement;
    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain('portfolio.empty');
  });

  it('should open detail modal when card emits viewDetail', () => {
    loadProjects();

    component['onViewDetail'](MOCK_PROJECTS[0]);
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('.portfolio__modal') as HTMLElement;
    expect(modal).toBeTruthy();
  });

  it('should close detail modal', () => {
    loadProjects();

    component['onViewDetail'](MOCK_PROJECTS[0]);
    fixture.detectChanges();

    component['closeDetail']();
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('.portfolio__modal');
    expect(modal).toBeNull();
  });

  it('should render modal with project info', () => {
    loadProjects();

    component['onViewDetail'](MOCK_PROJECTS[0]);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.portfolio__modal-title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Project One');
  });
});
