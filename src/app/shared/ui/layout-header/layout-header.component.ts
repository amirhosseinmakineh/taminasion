import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.css'],
  standalone: false,
})
export class LayoutHeaderComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  isDarkMode = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

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
