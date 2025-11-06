import { Component } from '@angular/core';
import { LayoutHeaderModule } from "../../shared/ui/layout-header/layout-header.module";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,  // Mark the component as standalone
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [LayoutHeaderModule],
})
export class AdminDashboardComponent {}
