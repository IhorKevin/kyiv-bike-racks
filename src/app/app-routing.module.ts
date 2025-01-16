import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/racks']);
const routes: Routes = [
    {
        path: 'editor',
        loadChildren: () =>
            import('./editor/editor.module').then((m) => m.EditorModule),
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

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
