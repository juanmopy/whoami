import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '@core/services/theme.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const themeServiceMock = {
    toggle: vi.fn(),
    currentTheme: signal<'light' | 'dark'>('light').asReadonly(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nav element with correct role', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('should render brand link', () => {
    const brand = fixture.nativeElement.querySelector('.navbar__brand');
    expect(brand).toBeTruthy();
    expect(brand.textContent.trim()).toBe('nav.brand');
  });

  it('should render navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('.navbar__link');
    expect(links.length).toBe(3);
  });

  it('should have menu closed by default', () => {
    const mobileMenu = fixture.nativeElement.querySelector('#mobile-menu');
    expect(mobileMenu).toBeNull();
  });

  it('should toggle mobile menu on hamburger click', () => {
    const hamburger = fixture.nativeElement.querySelector('.navbar__hamburger');
    hamburger.click();
    fixture.detectChanges();

    const mobileMenu = fixture.nativeElement.querySelector('#mobile-menu');
    expect(mobileMenu).toBeTruthy();
  });

  it('should close mobile menu when a link is clicked', () => {
    // Open menu
    const hamburger = fixture.nativeElement.querySelector('.navbar__hamburger');
    hamburger.click();
    fixture.detectChanges();

    // Click a link
    const mobileLink = fixture.nativeElement.querySelector('.navbar__mobile-link');
    mobileLink.click();
    fixture.detectChanges();

    const mobileMenu = fixture.nativeElement.querySelector('#mobile-menu');
    expect(mobileMenu).toBeNull();
  });

  it('should have aria-expanded attribute on hamburger', () => {
    const hamburger = fixture.nativeElement.querySelector('.navbar__hamburger');
    expect(hamburger.getAttribute('aria-expanded')).toBe('false');

    hamburger.click();
    fixture.detectChanges();
    expect(hamburger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should include theme toggle component', () => {
    const toggle = fixture.nativeElement.querySelector('app-theme-toggle');
    expect(toggle).toBeTruthy();
  });

  it('should render links with correct routerLink paths', () => {
    const links = fixture.nativeElement.querySelectorAll('.navbar__link');
    expect(links[0].getAttribute('href')).toBe('/about');
    expect(links[1].getAttribute('href')).toBe('/portfolio');
    expect(links[2].getAttribute('href')).toBe('/contact');
  });

  it('should render CTA button linking to booking', () => {
    const cta = fixture.nativeElement.querySelector('.navbar__cta');
    expect(cta).toBeTruthy();
    expect(cta.getAttribute('href')).toBe('/booking');
    expect(cta.textContent.trim()).toBe('nav.booking');
  });

  it('should render mobile CTA in open mobile menu', () => {
    const hamburger = fixture.nativeElement.querySelector('.navbar__hamburger');
    hamburger.click();
    fixture.detectChanges();

    const mobileCta = fixture.nativeElement.querySelector('.navbar__mobile-cta');
    expect(mobileCta).toBeTruthy();
    expect(mobileCta.getAttribute('href')).toBe('/booking');
    expect(mobileCta.textContent.trim()).toBe('nav.booking');
  });
});
