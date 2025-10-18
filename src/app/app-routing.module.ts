import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: 'business-search',
      loadChildren: () => import('./components/business-search/business-search.module')
        .then(m => m.BusinessSearchModule)
    },
    {
      path: 'business-details/:id',
      loadChildren: () => import('./components/business-details/business-details.module')
        .then(m => m.BusinessDetailsModule)
    },
    {
      path: 'business-details',
      loadChildren: () => import('./components/business-details/business-details.module')
        .then(m => m.BusinessDetailsModule)
    },
    {
      path: 'business-profile',
      loadChildren: () => import('./components/business-profile/business-profile.module')
        .then(m => m.BusinessProfileModule)
    },
    {
      path: 'business-owner-profile',
      loadChildren: () => import('./components/business-owner-profile/business-owner-profile.module')
        .then(m => m.BusinessOwnerProfileModule)
    },
    {
      path: 'businesssearch',
      redirectTo: 'business-search',
      pathMatch: 'full'
    },
  {
    path: '',
    loadChildren: () => import('./components/main-page/main-page.module')
      .then(m => m.MainPageModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
