import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacksPageComponent } from './racks-page/racks-page.component';
import { rackResolver } from '../services/rack.resolver';


const routes: Routes = [{
    path: 'racks',
    component: RacksPageComponent,
    data: {
        title: 'Карта'
    },
    resolve: {
        rack: rackResolver
    }
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class BikeRacksRoutingModule { }
