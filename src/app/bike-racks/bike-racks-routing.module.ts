import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RacksPageComponent} from './racks-page/racks-page.component';
import { RackResolver } from "../services/rack.resolver";


const routes: Routes = [{
    path: 'racks',
    component: RacksPageComponent,
    data: {
        title: 'Карта'
    },
    resolve: {
        rack: RackResolver
    }
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class BikeRacksRoutingModule { }
