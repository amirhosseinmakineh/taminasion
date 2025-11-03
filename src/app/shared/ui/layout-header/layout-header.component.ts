import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.css'],
  standalone: false,
})
export class LayoutHeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isScrolled = false;
  isDarkMode = false;
  isAuthenticated = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const storedPreference = window.localStorage.getItem('theme');
    if (storedPreference) {
      this.isDarkMode = storedPreference === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyThemeClass();

    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.authStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => (this.isAuthenticated = status));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyThemeClass();

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  get themeToggleLabel(): string {
    return this.isDarkMode
      ? $localize`غیرفعال کردن حالت شب`
      : $localize`فعال کردن حالت شب`;
  }

  async logout(): Promise<void> {
    this.authService.logout();
    this.closeMenu();
    await this.router.navigate(['/auth/login'], {
      state: {
        infoMessage: $localize`با موفقیت از حساب کاربری خود خارج شدید.`,
      },
    });
  }

  private applyThemeClass(): void {
    const body = this.document?.body;
    const root = this.document?.documentElement;

    if (!body || !root) {
      return;
    }

    body.classList.toggle('dark-theme', this.isDarkMode);
    root.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }
}
