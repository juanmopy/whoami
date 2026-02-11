import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer element', () => {
    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer.getAttribute('role')).toBe('contentinfo');
  });

  it('should render social links', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer__social-link');
    expect(links.length).toBe(4);
  });

  it('should have rel="noopener noreferrer" on social links', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer__social-link');
    links.forEach((link: HTMLAnchorElement) => {
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('should have target="_blank" on social links', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer__social-link');
    links.forEach((link: HTMLAnchorElement) => {
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('should display current year in copyright', () => {
    const copyright = fixture.nativeElement.querySelector('.footer__copyright');
    const currentYear = new Date().getFullYear().toString();
    expect(copyright.textContent).toContain(currentYear);
  });

  it('should have back to top button', () => {
    const button = fixture.nativeElement.querySelector('.footer__back-to-top');
    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('footer.backToTop');
  });

  it('should have aria-labels on all social links', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer__social-link');
    links.forEach((link: HTMLAnchorElement) => {
      expect(link.getAttribute('aria-label')).toBeTruthy();
    });
  });
});
