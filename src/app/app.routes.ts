import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RacksPageComponent } from './bike-racks/racks-page/racks-page.component';
import { rackResolver } from './services/rack.resolver';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/racks']);

export const routes: Routes = [
    {
        path: 'login',
        title: 'Вхід',
        loadComponent: () =>
            import('./login/login.component').then((m) => m.LoginComponent),
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
    {
        path: 'racks',
        component: RacksPageComponent,
        title: 'Карта',
        resolve: {
            rack: rackResolver,
        },
    },
];
