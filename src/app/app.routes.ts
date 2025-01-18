import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/racks']);

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'editor',
        loadChildren: () =>
            import('./editor/editor.routes').then((m) => m.routes),
        canActivate: [AuthGuard],
        data: {
            authGuardPipe: redirectUnauthorizedToLogin,
        },
    },
    {
        path: '',
        redirectTo: 'racks',
        pathMatch: 'full',
    },
];
