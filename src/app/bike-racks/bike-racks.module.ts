import { NgModule } from '@angular/core';

import { BikeRacksRoutingModule } from './bike-racks-routing.module';
import { RacksPageComponent } from './racks-page/racks-page.component';
import { SharedModule } from "../shared/shared.module";
import { GoogleMapsPipe } from './google-maps.pipe';
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [RacksPageComponent, GoogleMapsPipe],
    imports: [
        SharedModule,
        HttpClientModule,
        BikeRacksRoutingModule
    ]
})
export class BikeRacksModule { }
