import {Component, OnInit} from '@angular/core';
import {BikeRack} from "../bike-rack";
import {data} from "../racks-data";

@Component({
    selector: 'app-racks-page',
    templateUrl: './racks-page.component.html',
    styleUrls: ['./racks-page.component.styl']
})
export class RacksPageComponent implements OnInit {

    mapCenter: google.maps.LatLngLiteral;
    zoom: number = 15;
    mapOptions: google.maps.MapOptions = {
        minZoom: 11,
        maxZoom: 21,
        streetViewControl: false,
        fullscreenControl: false,
        panControl: false,
        mapTypeControl: false
    };

    racks: BikeRack[];

    private readonly initialKyivCoords: google.maps.LatLngLiteral = {
        lat: 50.449834,
        lng: 30.523799
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
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            };
            const onReject = () => {
                this.mapCenter = this.initialKyivCoords;
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onReject);
        }
    }

}
