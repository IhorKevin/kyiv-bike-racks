import { NgModule } from '@angular/core';

import { BikeRacksRoutingModule } from './bike-racks-routing.module';
import { RacksPageComponent } from './racks-page/racks-page.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
    declarations: [RacksPageComponent],
    imports: [
        SharedModule,
        BikeRacksRoutingModule
    ]
})
export class BikeRacksModule { }
