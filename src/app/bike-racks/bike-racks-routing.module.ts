import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './bike-racks.routes';

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class BikeRacksRoutingModule {}
