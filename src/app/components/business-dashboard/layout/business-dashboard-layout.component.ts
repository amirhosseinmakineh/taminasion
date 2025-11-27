import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessProfileStateService } from '../state/business-profile-state.service';

@Component({
  selector: 'app-business-dashboard-layout',
  templateUrl: './business-dashboard-layout.component.html',
  styleUrls: ['./business-dashboard-layout.component.css']
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
