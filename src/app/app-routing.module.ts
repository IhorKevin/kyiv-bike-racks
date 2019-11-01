import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: 'racks',
        loadChildren: () => import('./bike-racks/bike-racks.module').then(m => m.BikeRacksModule)
    },
    {
        path: '',
        redirectTo: 'racks',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
