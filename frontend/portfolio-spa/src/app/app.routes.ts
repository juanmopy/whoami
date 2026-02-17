import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/hero/hero.component').then((m) => m.HeroComponent),
    title: 'pageTitle.home',
  },
  {
    path: 'about',
    loadComponent: () => import('@features/about/about.component').then((m) => m.AboutComponent),
    title: 'pageTitle.about',
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('@features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
    title: 'pageTitle.portfolio',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('@features/contact/contact-form/contact-form.component').then(
        (m) => m.ContactFormComponent,
      ),
    title: 'pageTitle.contact',
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('@features/booking/booking.component').then((m) => m.BookingComponent),
    title: 'pageTitle.booking',
  },
];
