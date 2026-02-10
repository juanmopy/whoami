import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to text variant', () => {
    const el: HTMLElement = fixture.nativeElement;
    const skeleton = el.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--text')).toBe(true);
  });

  it('should apply circle variant class', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const skeleton = el.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--circle')).toBe(true);
  });

  it('should apply rect variant class', () => {
    fixture.componentRef.setInput('variant', 'rect');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const skeleton = el.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--rect')).toBe(true);
  });

  it('should apply card variant class', () => {
    fixture.componentRef.setInput('variant', 'card');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const skeleton = el.querySelector('.skeleton');
    expect(skeleton?.classList.contains('skeleton--card')).toBe(true);
  });

  it('should set custom width and height', () => {
    fixture.componentRef.setInput('width', '200px');
    fixture.componentRef.setInput('height', '3rem');
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.skeleton') as HTMLElement;
    expect(skeleton.style.width).toBe('200px');
    expect(skeleton.style.height).toBe('3rem');
  });

  it('should have aria-label for accessibility', () => {
    const skeleton = fixture.nativeElement.querySelector('.skeleton');
    expect(skeleton?.getAttribute('aria-label')).toBe('Loading content');
  });

  it('should have role=status', () => {
    const skeleton = fixture.nativeElement.querySelector('.skeleton');
    expect(skeleton?.getAttribute('role')).toBe('status');
  });

  it('should have screen reader text', () => {
    const srOnly = fixture.nativeElement.querySelector('.sr-only');
    expect(srOnly?.textContent).toContain('Loading');
  });
});
