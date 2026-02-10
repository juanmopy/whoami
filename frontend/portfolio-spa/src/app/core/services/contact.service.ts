import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export type ContactStatus = 'idle' | 'sending' | 'success' | 'error';

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  ok: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  private readonly MAX_SUBMISSIONS = 3;
  private readonly RATE_WINDOW_MS = 60_000;

  readonly status = signal<ContactStatus>('idle');
  readonly errorMessage = signal<string>('');
  private readonly submissions: number[] = [];

  send(data: ContactRequest): Observable<ContactResponse> {
    if (this.isRateLimited()) {
      this.status.set('error');
      this.errorMessage.set('Demasiados envíos. Intenta de nuevo en un minuto.');
      return throwError(() => new Error('Rate limited'));
    }

    this.status.set('sending');
    this.errorMessage.set('');

    return this.http.post<ContactResponse>(this.ENDPOINT, data).pipe(
      tap(() => {
        this.submissions.push(Date.now());
        this.status.set('success');
      }),
      catchError((error: HttpErrorResponse) => {
        this.status.set('error');
        this.errorMessage.set(
          error.status === 0
            ? 'Error de red. Verifica tu conexión.'
            : 'Error al enviar el mensaje. Intenta más tarde.',
        );
        return throwError(() => error);
      }),
    );
  }

  resetStatus(): void {
    this.status.set('idle');
    this.errorMessage.set('');
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    const recentSubmissions = this.submissions.filter(
      (timestamp) => now - timestamp < this.RATE_WINDOW_MS,
    );

    this.submissions.length = 0;
    this.submissions.push(...recentSubmissions);

    return recentSubmissions.length >= this.MAX_SUBMISSIONS;
  }
}
