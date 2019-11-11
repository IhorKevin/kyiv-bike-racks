import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BikeRackFormComponent} from "./bike-rack-form/bike-rack-form.component";
import {HomeComponent} from "./home/home.component";


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path: 'create',
        component: BikeRackFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditorRoutingModule { }
