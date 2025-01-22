import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BikeRack } from '../bike-rack';
import { GoogleMapsPipe } from '../google-maps.pipe';

@Component({
    selector: 'app-rack-card',
    templateUrl: './rack-card.component.html',
    styleUrls: ['./rack-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        GoogleMapsPipe,
        RouterLink,
        NgIf,
    ],
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
