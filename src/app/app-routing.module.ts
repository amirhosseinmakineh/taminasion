import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: 'business-search',
      loadChildren: () => import('./Components/BusinessSearch/business-search.module').then(m => m.BusinessSearchModule)
    },
    {
      path: 'business-details',
      loadChildren: () => import('./Components/BusinessDetails/business-details.module').then(m => m.BusinessDetailsModule)
    },
    {
      path: 'business-profile',
      loadChildren: () => import('./Components/BusinessProfile/business-profile.module').then(m => m.BusinessProfileModule)
    },
    {
      path: 'businesssearch',
      redirectTo: 'business-search',
      pathMatch: 'full'
    },
  {
    path: '',
    loadChildren: () => import('./Components/MainPage/main-page.module').then(m => m.MainPageModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
