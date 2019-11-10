import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private ngZone: NgZone) { }

  ngOnInit() {
  }

  login(): void {
    this.auth.login().then(credentials => {
      console.log('AUTH', credentials);
      this.ngZone.run(() => this.router.navigate(['/racks']));
    });
  }

}
