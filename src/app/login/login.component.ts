import { Component, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [MatButtonModule],
})
export class LoginComponent {
    private readonly router = inject(Router);
    private readonly auth = inject(AuthService);
    private readonly ngZone = inject(NgZone);
    private readonly snackBar = inject(MatSnackBar);

    login(): void {
        const onSuccess = () =>
            this.ngZone.run(() => this.router.navigate(['/racks']));
        const onError = (error) => {
            console.log('LOGIN ERROR', error);
            this.snackBar.open(error, 'OK', { duration: 3000 });
        };
        this.auth.login().then(onSuccess).catch(onError);
    }
}
