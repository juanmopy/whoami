import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ContactFormComponent } from './contact-form.component';
import { ContactService } from '@core/index';
import { of } from 'rxjs';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let contactService: ContactService;

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
      imports: [ContactFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component['form'].invalid).toBe(true);
  });

  it('should validate required fields', () => {
    component['onSubmit']();
    fixture.detectChanges();

    expect(component['hasError']('name')).toBe(true);
    expect(component['hasError']('email')).toBe(true);
    expect(component['hasError']('subject')).toBe(true);
    expect(component['hasError']('message')).toBe(true);
  });

  it('should validate email format', () => {
    component['form'].controls.email.setValue('not-an-email');
    component['form'].controls.email.markAsTouched();
    fixture.detectChanges();

    expect(component['hasError']('email')).toBe(true);
    expect(component['getError']('email')).toBe('Ingresa un email válido.');
  });

  it('should validate minlength for name', () => {
    component['form'].controls.name.setValue('A');
    component['form'].controls.name.markAsTouched();
    fixture.detectChanges();

    expect(component['hasError']('name')).toBe(true);
    expect(component['getError']('name')).toBe('Mínimo 2 caracteres.');
  });

  it('should validate minlength for message', () => {
    component['form'].controls.message.setValue('Short');
    component['form'].controls.message.markAsTouched();
    fixture.detectChanges();

    expect(component['hasError']('message')).toBe(true);
    expect(component['getError']('message')).toBe('Mínimo 10 caracteres.');
  });

  it('should not submit when form is invalid', () => {
    const sendSpy = vi.spyOn(contactService, 'send');

    component['onSubmit']();

    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should submit valid form', () => {
    const sendSpy = vi.spyOn(contactService, 'send').mockReturnValue(of({ ok: true }));

    component['form'].setValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a message with enough characters.',
      honeypot: '',
    });

    component['onSubmit']();

    expect(sendSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a message with enough characters.',
    });
  });

  it('should reset form on successful submit', () => {
    vi.spyOn(contactService, 'send').mockReturnValue(of({ ok: true }));

    component['form'].setValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a valid message for testing.',
      honeypot: '',
    });

    component['onSubmit']();

    expect(component['form'].controls.name.value).toBe('');
    expect(component['submitted']()).toBe(false);
  });

  it('should detect honeypot and skip real submission', () => {
    const sendSpy = vi.spyOn(contactService, 'send');

    component['form'].setValue({
      name: 'Bot',
      email: 'bot@spam.com',
      subject: 'Spam',
      message: 'This is a spam message.',
      honeypot: 'bot-filled-this',
    });

    component['onSubmit']();

    expect(sendSpy).not.toHaveBeenCalled();
    expect(contactService.status()).toBe('success');
  });

  it('should render error messages in template', () => {
    component['onSubmit']();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll(
      '.contact__error',
    ) as NodeListOf<HTMLElement>;
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should hide honeypot field visually', () => {
    const honeypot = fixture.nativeElement.querySelector('.contact__honeypot') as HTMLElement;
    expect(honeypot).toBeTruthy();
    expect(honeypot.getAttribute('aria-hidden')).toBe('true');
  });

  it('should show success view after submission', () => {
    contactService.status.set('success');
    fixture.detectChanges();

    const success = fixture.nativeElement.querySelector('.contact__success') as HTMLElement;
    expect(success).toBeTruthy();
  });

  it('should show error alert on service error', () => {
    contactService.status.set('error');
    contactService.errorMessage.set('Error de red.');
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.contact__alert--error') as HTMLElement;
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Error de red.');
  });

  it('should disable submit button while sending', () => {
    contactService.status.set('sending');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
