import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ResetPasswordRedirectComponent } from './components/auth/reset-password-redirect/reset-password-redirect.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ToastContainerComponent } from './shared/ui/toast-container/toast-container.component';

@NgModule({
  declarations: [AppComponent, ResetPasswordRedirectComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, ToastContainerComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
