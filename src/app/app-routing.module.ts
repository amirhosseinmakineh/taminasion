import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordRedirectComponent } from './components/auth/reset-password-redirect/reset-password-redirect.component';
import { AuthGuard } from './guards/auth.guard';
import { OnboardingRedirectGuard } from './guards/onboarding-redirect.guard';

const routes: Routes = [
  {
    path: 'onboarding',
    canActivate: [OnboardingRedirectGuard],
    loadComponent: () =>
      import('./components/owner-onboarding/owner-onboarding.component').then(m => m.OwnerOnboardingComponent),
  },
  {
    path: 'app',
    loadChildren: () => import('./components/owner-app/owner-app.module').then(m => m.OwnerAppModule),
  },
  {
    path: 'business-search',
    loadChildren: () =>
      import('./components/business-search/business-search.module').then(m => m.BusinessSearchModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'business-details/:id',
    loadChildren: () =>
      import('./components/business-details/business-details.module').then(m => m.BusinessDetailsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'business-details',
    loadChildren: () =>
      import('./components/business-details/business-details.module').then(m => m.BusinessDetailsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'business-profile',
    loadChildren: () =>
      import('./components/business-profile/business-profile.module').then(m => m.BusinessProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'business-owner-profile',
    loadChildren: () =>
      import('./components/business-owner-profile/business-owner-profile.module').then(
        m => m.BusinessOwnerProfileModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-dashboard',
    loadChildren: () =>
      import('./components/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'ResetPasswordRouter',
    component: ResetPasswordRedirectComponent,
  },
  {
    path: 'businesssearch',
    redirectTo: 'business-search',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./components/main-page/main-page.module').then(m => m.MainPageModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
