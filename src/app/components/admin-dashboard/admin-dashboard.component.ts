import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

interface AdminCustomer {
  id: number;
  name: string;
  phone: string;
  note: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AdminDashboardComponent {
  isSidebarOpen = false;
  activeTab: 'overview' | 'customers' | 'reports' = 'overview';
  searchTerm = '';

  customers: AdminCustomer[] = [
    { id: 1, name: 'مریم احمدی', phone: '09121234567', note: 'مشتری وفادار از ۱۴۰۲', createdAt: '۱۴۰۴/۰۸/۱۵' },
    { id: 2, name: 'الهام شریفی', phone: '09351234567', note: 'از اینستاگرام', createdAt: '۱۴۰۴/۰۸/۱۵' },
    { id: 3, name: 'سارا محمدی', phone: '09129876543', note: '', createdAt: '۱۴۰۴/۰۸/۱۴' },
  ];

  filteredCustomers: AdminCustomer[] = [...this.customers];
  nextCustomerId = 4;

  isCustomerModalOpen = false;
  isDeleteModalOpen = false;
  editingCustomer: AdminCustomer | null = null;
  customerForm = { name: '', phone: '', note: '' };
  customerToDelete: number | null = null;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setActiveTab(tab: 'overview' | 'customers' | 'reports'): void {
    this.activeTab = tab;
    if (this.isBrowser && window.innerWidth <= 900) {
      this.closeSidebar();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  openCustomerModal(customer?: AdminCustomer): void {
    if (customer) {
      this.editingCustomer = { ...customer };
      this.customerForm = {
        name: customer.name,
        phone: customer.phone,
        note: customer.note,
      };
    } else {
      this.editingCustomer = null;
      this.customerForm = { name: '', phone: '', note: '' };
    }
    this.isCustomerModalOpen = true;
  }

  closeCustomerModal(): void {
    this.isCustomerModalOpen = false;
  }

  saveCustomer(): void {
    const name = this.customerForm.name.trim();
    const phone = this.customerForm.phone.trim();
    const note = this.customerForm.note.trim();

    if (!name || !phone) {
      return;
    }

    if (this.editingCustomer) {
      this.customers = this.customers.map(customer =>
        customer.id === this.editingCustomer!.id ? { ...customer, name, phone, note } : customer
      );
    } else {
      this.customers = [
        ...this.customers,
        {
          id: this.nextCustomerId++,
          name,
          phone,
          note,
          createdAt: '۱۴۰۴/۰۸/۱۵',
        },
      ];
    }

    this.closeCustomerModal();
    this.applyFilter();
  }

  confirmDelete(customerId: number): void {
    this.customerToDelete = customerId;
    this.isDeleteModalOpen = true;
  }

  deleteCustomer(): void {
    if (this.customerToDelete !== null) {
      this.customers = this.customers.filter(customer => customer.id !== this.customerToDelete);
      this.customerToDelete = null;
      this.applyFilter();
    }
    this.isDeleteModalOpen = false;
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.customerToDelete = null;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isBrowser && window.innerWidth > 900) {
      this.closeSidebar();
    }
  }

  private applyFilter(): void {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      this.filteredCustomers = [...this.customers];
      return;
    }

    this.filteredCustomers = this.customers.filter(customer => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(this.searchTerm.trim())
      );
    });
  }
}
