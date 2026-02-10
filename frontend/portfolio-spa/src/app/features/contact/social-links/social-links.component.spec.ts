import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialLinksComponent } from './social-links.component';

describe('SocialLinksComponent', () => {
  let component: SocialLinksComponent;
  let fixture: ComponentFixture<SocialLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocialLinksComponent],
    });

    fixture = TestBed.createComponent(SocialLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all social links', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.social-links__link',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBe(4);
  });

  it('should have correct link names', () => {
    const names = ['GitHub', 'LinkedIn', 'Twitter', 'Email'];
    const linkElements = fixture.nativeElement.querySelectorAll(
      '.social-links__link',
    ) as NodeListOf<HTMLAnchorElement>;
    linkElements.forEach((link, i) => {
      expect(link.getAttribute('title')).toBe(names[i]);
    });
  });

  it('should have target="_blank" on external links', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.social-links__link',
    ) as NodeListOf<HTMLAnchorElement>;
    links.forEach((link) => {
      expect(link.target).toBe('_blank');
    });
  });

  it('should have rel="noopener noreferrer" on all links', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.social-links__link',
    ) as NodeListOf<HTMLAnchorElement>;
    links.forEach((link) => {
      expect(link.rel).toBe('noopener noreferrer');
    });
  });

  it('should have aria-label on all links', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.social-links__link',
    ) as NodeListOf<HTMLAnchorElement>;
    links.forEach((link) => {
      expect(link.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('should render SVG icons', () => {
    const icons = fixture.nativeElement.querySelectorAll(
      '.social-links__icon svg',
    ) as NodeListOf<SVGElement>;
    expect(icons.length).toBe(4);
  });

  it('should have correct GitHub URL', () => {
    const link = fixture.nativeElement.querySelector('.social-links__link') as HTMLAnchorElement;
    expect(link.href).toContain('github.com');
  });
});
