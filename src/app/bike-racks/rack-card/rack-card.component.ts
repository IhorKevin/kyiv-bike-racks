import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BikeRack} from "../bike-rack";

@Component({
    selector: 'app-rack-card',
    templateUrl: './rack-card.component.html',
    styleUrls: ['./rack-card.component.styl'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RackCardComponent {

    @Input() rack: BikeRack;
    @Input() canEdit: boolean;

}
