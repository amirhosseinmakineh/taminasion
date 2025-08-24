import { Routes } from '@angular/router';
import { BusinessSearchComponent } from './Components/BusinessSearch/BusinessSearch.component';
import { MainPageComponent } from './Components/MainPage/MainPage.component'

export const routes: Routes = [
  { path: 'business-search', component: BusinessSearchComponent },
  { path: 'businesssearch', redirectTo: 'business-search', pathMatch: 'full' }, // alias
  { path: '', component: MainPageComponent },
  { path: '**', redirectTo: '' }
];
