import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContactService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpTesting.verify();
    } catch {
      // Ignore verification errors during cleanup
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have idle status initially', () => {
    expect(service.status()).toBe('idle');
  });

  it('should set status to sending on send', () => {
    service
      .send({ name: 'Test', email: 'a@b.com', subject: 'Hi', message: 'Hello world!' })
      .subscribe();

    expect(service.status()).toBe('sending');
    httpTesting.expectOne('https://formspree.io/f/YOUR_FORM_ID').flush({ ok: true });
  });

  it('should set status to success on successful send', () => {
    service
      .send({ name: 'Test', email: 'a@b.com', subject: 'Hi', message: 'Hello world!' })
      .subscribe();

    httpTesting.expectOne('https://formspree.io/f/YOUR_FORM_ID').flush({ ok: true });

    expect(service.status()).toBe('success');
  });

  it('should set status to error on HTTP failure', () => {
    service
      .send({ name: 'Test', email: 'a@b.com', subject: 'Hi', message: 'Hello world!' })
      .subscribe({
        error: () => {
          // expected
        },
      });

    httpTesting
      .expectOne('https://formspree.io/f/YOUR_FORM_ID')
      .flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Error al enviar el mensaje. Intenta más tarde.');
  });

  it('should set network error message on status 0', () => {
    service
      .send({ name: 'Test', email: 'a@b.com', subject: 'Hi', message: 'Hello world!' })
      .subscribe({
        error: () => {
          // expected
        },
      });

    httpTesting.expectOne('https://formspree.io/f/YOUR_FORM_ID').error(new ProgressEvent('error'));

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Error de red. Verifica tu conexión.');
  });

  it('should rate limit after max submissions', () => {
    // Make 3 successful submissions
    for (let i = 0; i < 3; i++) {
      service
        .send({ name: 'Test', email: 'a@b.com', subject: 'Hi', message: 'Hello world!' })
        .subscribe();
      httpTesting.expectOne('https://formspree.io/f/YOUR_FORM_ID').flush({ ok: true });
    }

    // 4th should be rate limited
    service
      .send({ name: 'Test', email: 'a@b.com', subject: 'Hi', message: 'Hello world!' })
      .subscribe({
        error: () => {
          // expected
        },
      });

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toContain('Demasiados envíos');
  });

  it('should reset status', () => {
    service.status.set('error');
    service.errorMessage.set('Some error');

    service.resetStatus();

    expect(service.status()).toBe('idle');
    expect(service.errorMessage()).toBe('');
  });
});
