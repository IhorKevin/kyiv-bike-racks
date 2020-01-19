import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
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
    @Input() canDelete: boolean;

    @Output() delete: EventEmitter<void>;

    constructor() {
        this.delete = new EventEmitter();
    }

}
