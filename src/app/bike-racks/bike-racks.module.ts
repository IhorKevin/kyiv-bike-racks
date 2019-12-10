import { NgModule } from '@angular/core';
import { BikeRacksRoutingModule } from './bike-racks-routing.module';
import { RacksPageComponent } from './racks-page/racks-page.component';
import { SharedModule } from "../shared/shared.module";
import { GoogleMapsPipe } from './google-maps.pipe';
import { RackCardComponent } from './rack-card/rack-card.component';


@NgModule({
    declarations: [RacksPageComponent, GoogleMapsPipe, RackCardComponent],
    imports: [
        SharedModule,
        BikeRacksRoutingModule
    ]
})
export class BikeRacksModule { }
