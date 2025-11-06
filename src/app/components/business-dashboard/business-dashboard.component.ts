import { Component } from '@angular/core';
import { LayoutHeaderModule } from "../../shared/ui/layout-header/layout-header.module";

type UserStatus = 'active' | 'pending' | 'blocked';

type UserFilter = 'all' | UserStatus;

interface ManagedUser {
  id: number;
  name: string;
  phone: string;
  lastReservation: string;
  status: UserStatus;
  upcomingVisits: number;
  tags: string[];
}

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css'],
  imports: [LayoutHeaderModule],
})
export class BusinessDashboardComponent {
  readonly managedUsers: ManagedUser[] = [
    {
      id: 1,
      name: 'مهسا رضایی',
      phone: '0912 123 4567',
      lastReservation: '1402/11/04',
      status: 'active',
      upcomingVisits: 2,
      tags: ['سرویس VIP', 'مشتری وفادار'],
    },
    {
      id: 2,
      name: 'سارا احمدی',
      phone: '0935 987 6543',
      lastReservation: '1402/10/27',
      status: 'pending',
      upcomingVisits: 1,
      tags: ['منتظر تایید'],
    },
    {
      id: 3,
      name: 'لیلا نوری',
      phone: '0910 222 1122',
      lastReservation: '1402/09/18',
      status: 'blocked',
      upcomingVisits: 0,
      tags: ['عدم حضور'],
    },
    {
      id: 4,
      name: 'بهاره هاشمی',
      phone: '0915 888 0099',
      lastReservation: '1402/11/10',
      status: 'active',
      upcomingVisits: 3,
      tags: ['سرویس رنگ مو'],
    },
  ];

  filter: UserFilter = 'all';

  // Map for statuses, can easily be expanded
  private statusLabels: Record<UserStatus, string> = {
    active: 'فعال',
    pending: 'منتظر تایید',
    blocked: 'مسدود',
  };

  // Get the total number of users
  get totalUsers(): number {
    return this.managedUsers.length;
  }

  // Get the number of active users
  get activeUsers(): number {
    return this.getUserCountByStatus('active');
  }

  // Get the number of pending users
  get pendingUsers(): number {
    return this.getUserCountByStatus('pending');
  }

  // Get the number of blocked users
  get blockedUsers(): number {
    return this.getUserCountByStatus('blocked');
  }

  // Filter users by the selected filter
  get filteredUsers(): ManagedUser[] {
    return this.filter === 'all'
      ? this.managedUsers
      : this.managedUsers.filter(user => user.status === this.filter);
  }

  // Method to change the filter status
  setFilter(filter: UserFilter): void {
    this.filter = filter;
  }

  // Helper function to get status label
  getStatusLabel(status: UserStatus): string {
    return this.statusLabels[status] || status;
  }

  // Helper function to get user count by status
  private getUserCountByStatus(status: UserStatus): number {
    return this.managedUsers.filter(user => user.status === status).length;
  }
}
