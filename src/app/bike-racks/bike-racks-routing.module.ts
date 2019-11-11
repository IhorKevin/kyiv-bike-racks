import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RacksPageComponent} from './racks-page/racks-page.component';


const routes: Routes = [{
    path: 'racks',
    component: RacksPageComponent,
    data: {
        title: 'Карта'
    }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BikeRacksRoutingModule { }
