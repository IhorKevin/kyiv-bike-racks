import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    constructor(
        private auth: AuthService,
        private router: Router,
        private ngZone: NgZone,
        private snackBar: MatSnackBar
    ) { }

    login(): void {
        const onSuccess = () => this.ngZone.run(() => this.router.navigate(['/racks']));
        const onError = (error) => {
            console.log('LOGIN ERROR', error);
            this.snackBar.open(error, 'OK', {duration: 3000});
        };
        this.auth
            .login()
            .then(onSuccess)
            .catch(onError);
    }

}
