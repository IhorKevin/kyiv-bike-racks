import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-racks-page',
    templateUrl: './racks-page.component.html',
    styleUrls: ['./racks-page.component.styl']
})
export class RacksPageComponent implements OnInit {

    latitude: number = 50.449834;
    longitude: number = 30.523799;

    constructor() { }

    ngOnInit() {
    }

}
