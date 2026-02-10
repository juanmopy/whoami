import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/hero/hero.component').then((m) => m.HeroComponent),
    title: 'Inicio — Portfolio',
  },
  {
    path: 'about',
    loadComponent: () => import('@features/about/about.component').then((m) => m.AboutComponent),
    title: 'Sobre Mí — Portfolio',
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('@features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
    title: 'Portfolio — Proyectos',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('@features/contact/contact-form/contact-form.component').then(
        (m) => m.ContactFormComponent,
      ),
    title: 'Contacto — Portfolio',
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('@features/booking/booking.component').then((m) => m.BookingComponent),
    title: 'Agendar — Portfolio',
  },
];
