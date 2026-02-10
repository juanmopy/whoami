import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '@core/index';
import { AnimateOnScrollDirective } from '@shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, AnimateOnScrollDirective],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  protected readonly contactService = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitted = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    honeypot: new FormControl('', { nonNullable: true }),
  });

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      return;
    }

    // Honeypot check — bots fill hidden fields
    if (this.form.controls.honeypot.value) {
      this.contactService.status.set('success');
      return;
    }

    const { name, email, subject, message } = this.form.getRawValue();

    this.contactService
      .send({ name, email, subject, message })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.form.reset();
          this.submitted.set(false);
        },
      });
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  protected getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength as number;
      return `Mínimo ${min} caracteres.`;
    }
    if (control.errors['email']) {
      return 'Ingresa un email válido.';
    }
    return '';
  }
}
