import { Component } from '@angular/core';

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

  get totalUsers(): number {
    return this.managedUsers.length;
  }

  get activeUsers(): number {
    return this.managedUsers.filter(user => user.status === 'active').length;
  }

  get pendingUsers(): number {
    return this.managedUsers.filter(user => user.status === 'pending').length;
  }

  get blockedUsers(): number {
    return this.managedUsers.filter(user => user.status === 'blocked').length;
  }

  get filteredUsers(): ManagedUser[] {
    if (this.filter === 'all') {
      return this.managedUsers;
    }

    return this.managedUsers.filter(user => user.status === this.filter);
  }

  setFilter(filter: UserFilter): void {
    this.filter = filter;
  }

  getStatusLabel(status: UserStatus): string {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'pending':
        return 'منتظر تایید';
      case 'blocked':
        return 'مسدود';
      default:
        return status;
    }
  }
}
