import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

@Component({
  selector: 'app-owner-app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-app-layout.component.html',
  styleUrls: ['./owner-app-layout.component.css']
})
export class OwnerAppLayoutComponent {
  sidebarOpen = false;
  salonName = 'سالن رویال';
  ownerName = 'صاحب سالن';

  navItems: NavItem[] = [
    { label: 'داشبورد', path: '/app/dashboard' },
    { label: 'مدیریت مشتری‌ها', path: '/app/customers' },
    { label: 'مدیریت کارمندان', path: '/app/staff' },
    { label: 'حسابداری', path: '/app/finance' },
    { label: 'ویدیو مارکتینگ', path: '/app/video-marketing' },
    { label: 'مدیریت وسایل سالن', path: '/app/inventory' },
    { label: 'تنظیمات', path: '/app/settings' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
