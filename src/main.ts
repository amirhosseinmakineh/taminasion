import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter, withRouterConfig } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes) // این خط HttpClient رو برای کل اپلیکیشن فراهم می‌کنه
  ]
}).catch(err => console.error(err));
