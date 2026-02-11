import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFilterComponent } from './project-filter.component';

const MOCK_TAGS = ['Angular', 'TypeScript', 'Node.js', 'Docker'];

describe('ProjectFilterComponent', () => {
  let component: ProjectFilterComponent;
  let fixture: ComponentFixture<ProjectFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectFilterComponent],
    });

    fixture = TestBed.createComponent(ProjectFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tags', MOCK_TAGS);
    fixture.componentRef.setInput('selectedTags', []);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all tag chips', () => {
    const chips = fixture.nativeElement.querySelectorAll(
      '.filter__chip',
    ) as NodeListOf<HTMLElement>;
    expect(chips.length).toBe(4);
    expect(chips[0].textContent?.trim()).toBe('Angular');
  });

  it('should emit tag when chip is clicked', () => {
    const spy = vi.fn();
    component.filterChange.subscribe(spy);

    const chip = fixture.nativeElement.querySelector('.filter__chip') as HTMLElement;
    chip.click();

    expect(spy).toHaveBeenCalledWith(['Angular']);
  });

  it('should remove tag when already selected chip is clicked', () => {
    fixture.componentRef.setInput('selectedTags', ['Angular']);
    fixture.detectChanges();

    const spy = vi.fn();
    component.filterChange.subscribe(spy);

    const chip = fixture.nativeElement.querySelector('.filter__chip') as HTMLElement;
    chip.click();

    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should show active class on selected chips', () => {
    fixture.componentRef.setInput('selectedTags', ['Angular']);
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('.filter__chip') as HTMLElement;
    expect(chip.classList.contains('filter__chip--active')).toBe(true);
  });

  it('should set aria-pressed on chips', () => {
    fixture.componentRef.setInput('selectedTags', ['Angular']);
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll(
      '.filter__chip',
    ) as NodeListOf<HTMLElement>;
    expect(chips[0].getAttribute('aria-pressed')).toBe('true');
    expect(chips[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('should show clear button when tags are selected', () => {
    fixture.componentRef.setInput('selectedTags', ['Angular']);
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector('.filter__clear') as HTMLElement;
    expect(clearBtn).toBeTruthy();
    expect(clearBtn.textContent?.trim()).toBe('Clear filters');
  });

  it('should hide clear button when no tags selected', () => {
    const clearBtn = fixture.nativeElement.querySelector('.filter__clear');
    expect(clearBtn).toBeNull();
  });

  it('should emit empty array on clear', () => {
    fixture.componentRef.setInput('selectedTags', ['Angular', 'Node.js']);
    fixture.detectChanges();

    const spy = vi.fn();
    component.filterChange.subscribe(spy);

    const clearBtn = fixture.nativeElement.querySelector('.filter__clear') as HTMLElement;
    clearBtn.click();

    expect(spy).toHaveBeenCalledWith([]);
  });
});
