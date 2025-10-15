import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.css'],
  standalone: false,
})
export class LayoutHeaderComponent {
  isMenuOpen = false;
  isScrolled = false;

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
}
