import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps'

import { BikeRacksRoutingModule } from './bike-racks-routing.module';
import { RacksPageComponent } from './racks-page/racks-page.component';


@NgModule({
    declarations: [RacksPageComponent],
    imports: [
        CommonModule,
        BikeRacksRoutingModule,
        GoogleMapsModule
    ]
})
export class BikeRacksModule { }
