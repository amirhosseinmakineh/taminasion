import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
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
export class LayoutHeaderComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isMenuOpen = false;
  isScrolled = false;
  isDarkMode = false;
  isAuthenticated = false;

  private readonly destroy$ = new Subject<void>();
  private readonly themeStorageKey = 'theme';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /* -------------------------------
   🟢 INITIALIZATION
  -------------------------------- */
  ngOnInit(): void {
    if (!this.isBrowser()) return;

    // دریافت تم ذخیره‌شده از LocalStorage
    const storedPreference = window.localStorage.getItem(this.themeStorageKey);

    if (storedPreference) {
      this.isDarkMode = storedPreference === 'dark';
    } else {
      // اگر چیزی ذخیره نشده بود، از تنظیمات سیستم کاربر پیروی کن
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode = prefersDark;
      window.localStorage.setItem(
        this.themeStorageKey,
        prefersDark ? 'dark' : 'light'
      );
    }

    this.isAuthenticated = this.authService.isAuthenticated();

    this.authService.authStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => (this.isAuthenticated = status));
  }

  ngAfterViewInit(): void {
    this.applyThemeClass();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* -------------------------------
   🧭 SCROLL & MENU CONTROL
  -------------------------------- */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser()) return;
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  /* -------------------------------
   🌙 DARK MODE
  -------------------------------- */
  toggleDarkMode(): void {
    if (!this.isBrowser()) return;

    this.isDarkMode = !this.isDarkMode;
    this.applyThemeClass();
    window.localStorage.setItem(
      this.themeStorageKey,
      this.isDarkMode ? 'dark' : 'light'
    );
  }

  private applyThemeClass(): void {
    const root = this.document.documentElement;
    if (!root) return;

    const theme = this.isDarkMode ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);
  }

  get themeToggleLabel(): string {
    return this.isDarkMode
      ? $localize`غیرفعال کردن حالت شب`
      : $localize`فعال کردن حالت شب`;
  }

  /* -------------------------------
   🚪 LOGOUT
  -------------------------------- */
  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/auth/login'], {
      state: {
        infoMessage: $localize`با موفقیت از حساب کاربری خود خارج شدید.`,
      },
    });
  }

  /* -------------------------------
   🧠 UTILITIES
  -------------------------------- */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!this.document?.defaultView;
  }
}
