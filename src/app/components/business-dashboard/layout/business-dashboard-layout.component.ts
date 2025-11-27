import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessProfileStateService } from '../state/business-profile-state.service';

@Component({
  selector: 'app-business-dashboard-layout',
  standalone: true,
  templateUrl: './business-dashboard-layout.component.html',
  styleUrls: ['./business-dashboard-layout.component.css'],
  imports: [CommonModule, RouterModule]
})
export class BusinessDashboardLayoutComponent {
  isSidebarOpen = false;
  profileCompleted$: Observable<boolean>;

  constructor(private profileState: BusinessProfileStateService, private router: Router) {
    this.profileCompleted$ = this.profileState.profileCompleted$;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.closeSidebar();
  }
}
