import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router,
        private ngZone: NgZone,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
    }

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
