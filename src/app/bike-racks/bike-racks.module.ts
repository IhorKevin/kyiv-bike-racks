import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BikeRacksRoutingModule } from './bike-racks-routing.module';
import { RacksPageComponent } from './racks-page/racks-page.component';


@NgModule({
    declarations: [RacksPageComponent],
    imports: [
        CommonModule,
        BikeRacksRoutingModule
    ]
})
export class BikeRacksModule { }
