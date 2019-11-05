import {Component, OnInit} from '@angular/core';
import {BikeRack} from "../bike-rack";
import {data} from "../racks-data";

@Component({
    selector: 'app-racks-page',
    templateUrl: './racks-page.component.html',
    styleUrls: ['./racks-page.component.styl']
})
export class RacksPageComponent implements OnInit {

    mapCenter: {
        latitude: number;
        longitude: number;
    };
    zoom: number = 15;
    maxZoom: number = 21;
    minZoom: number = 11;

    racks: BikeRack[];

    private readonly initialKyivCoords = {
        latitude: 50.449834,
        longitude: 30.523799
    };

    constructor() {
        this.mapCenter = this.initialKyivCoords;
        this.racks = data;
    }

    ngOnInit() {
        this.centerMapToUserPosition();
    }

    centerMapToUserPosition(): void {
        if(navigator.geolocation) {
            const onSuccess = position => {
                this.mapCenter = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            };
            const onReject = () => {
                this.mapCenter = this.initialKyivCoords;
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onReject);
        }
    }

}
