import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card.component';
import { Project } from '@models/index';

const MOCK_PROJECT: Project = {
  id: 'test-1',
  title: 'Test Project',
  description: 'A test project description for unit testing.',
  image: 'assets/images/test.webp',
  tags: ['Angular', 'TypeScript'],
  demoUrl: 'https://demo.example.com',
  repoUrl: 'https://github.com/user/test',
  featured: true,
};

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
    });

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', MOCK_PROJECT);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render project title', () => {
    const title = fixture.nativeElement.querySelector('.card__title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Test Project');
  });

  it('should render project description', () => {
    const desc = fixture.nativeElement.querySelector('.card__description') as HTMLElement;
    expect(desc.textContent?.trim()).toContain('A test project description');
  });

  it('should render project tags', () => {
    const tags = fixture.nativeElement.querySelectorAll('.card__tag') as NodeListOf<HTMLElement>;
    expect(tags.length).toBe(2);
    expect(tags[0].textContent?.trim()).toBe('Angular');
    expect(tags[1].textContent?.trim()).toBe('TypeScript');
  });

  it('should render image with lazy loading', () => {
    const img = fixture.nativeElement.querySelector('.card__image') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.alt).toBe('Test Project');
  });

  it('should render demo link with noopener noreferrer', () => {
    const demoLink = fixture.nativeElement.querySelector('.card__link--demo') as HTMLAnchorElement;
    expect(demoLink).toBeTruthy();
    expect(demoLink.href).toContain('demo.example.com');
    expect(demoLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(demoLink.getAttribute('target')).toBe('_blank');
  });

  it('should render repo link with noopener noreferrer', () => {
    const repoLink = fixture.nativeElement.querySelector('.card__link--repo') as HTMLAnchorElement;
    expect(repoLink).toBeTruthy();
    expect(repoLink.href).toContain('github.com/user/test');
    expect(repoLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should emit viewDetail on click', () => {
    const spy = vi.fn();
    component.viewDetail.subscribe(spy);

    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;
    card.click();

    expect(spy).toHaveBeenCalledWith(MOCK_PROJECT);
  });

  it('should not render demo link when demoUrl is missing', () => {
    fixture.componentRef.setInput('project', { ...MOCK_PROJECT, demoUrl: undefined });
    fixture.detectChanges();

    const demoLink = fixture.nativeElement.querySelector('.card__link--demo');
    expect(demoLink).toBeNull();
  });

  it('should have keyboard accessibility', () => {
    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;
    expect(card.getAttribute('tabindex')).toBe('0');
    expect(card.getAttribute('role')).toBe('button');
  });
});
