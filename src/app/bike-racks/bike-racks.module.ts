import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { BikeRacksRoutingModule } from './bike-racks-routing.module';
import { RacksPageComponent } from './racks-page/racks-page.component';


@NgModule({
    declarations: [RacksPageComponent],
    imports: [
        CommonModule,
        BikeRacksRoutingModule,
        AgmCoreModule
    ]
})
export class BikeRacksModule { }
