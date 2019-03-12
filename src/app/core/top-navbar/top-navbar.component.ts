import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-top-navbar',
  styleUrls: ['./styles/top-navbar.styles.scss'],
  templateUrl: './top-navbar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarComponent {
  navbarCollapsed = true;

  constructor(public router: Router, private authService: AuthService) {
    
  }

  logout(): void {
    this.authService.logout()
    .then(() => {
      this.router.navigate(['/login']);
    }).catch(error => console.log(error));
  }
}
