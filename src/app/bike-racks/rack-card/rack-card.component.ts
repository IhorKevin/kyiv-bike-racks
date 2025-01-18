import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { BikeRack } from '../bike-rack';
import { SharedModule } from '../../shared/shared.module';
import { GoogleMapsPipe } from '../google-maps.pipe';

@Component({
    selector: 'app-rack-card',
    templateUrl: './rack-card.component.html',
    styleUrls: ['./rack-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, SharedModule, GoogleMapsPipe, RouterLink]
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
