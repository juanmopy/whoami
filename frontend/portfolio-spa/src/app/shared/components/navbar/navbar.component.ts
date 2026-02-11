import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { DOCUMENT } from '@angular/common';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeToggleComponent, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly isMenuOpen = signal(false);
  protected readonly isScrolled = signal(false);

  protected readonly navLinks: NavLink[] = [
    { label: 'nav.about', path: '/about' },
    { label: 'nav.portfolio', path: '/portfolio' },
    { label: 'nav.contact', path: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollY = this.document.defaultView?.scrollY ?? 0;
    this.isScrolled.set(scrollY > 50);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
