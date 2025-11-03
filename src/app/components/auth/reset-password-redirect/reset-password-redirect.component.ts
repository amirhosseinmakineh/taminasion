import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-reset-password-redirect',
  template: '',
  standalone: false,
})
export class ResetPasswordRedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const token = params.get('token');

      void this.router.navigate(['/auth/reset-password'], {
        queryParams: token ? { token } : {},
        replaceUrl: true,
      });
    });
  }
}
