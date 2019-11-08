import {Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {BikeRack} from "../bike-rack";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'app-racks-page',
    templateUrl: './racks-page.component.html',
    styleUrls: ['./racks-page.component.styl']
})
export class RacksPageComponent implements OnInit {

    userPosition: Position;
    zoom: number = 15;

    mapOptions: google.maps.MapOptions;

    userMarkerOptions: google.maps.MarkerOptions = {
        icon: '/assets/user-dot.svg',
        visible: true
    };

    racks: Observable<BikeRack[]>;
    selectedRack: BikeRack;

    @ViewChild('googleMap', {read: GoogleMap}) mapRef: GoogleMap;

    private readonly KyivCenterCoords: google.maps.LatLngLiteral = {
        lat: 50.449834,
        lng: 30.523799
    };

    private readonly minZoom = 11;
    private readonly maxZoom = 19;

    constructor(private auth: AuthService, private fs: AngularFirestore) {
        this.mapOptions = {
            center: this.KyivCenterCoords,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            streetViewControl: false,
            fullscreenControl: false,
            panControl: false,
            mapTypeControl: false
        };
        this.racks = this.fs.collection<BikeRack>('/racks').valueChanges({idField: 'id'});
    }

    ngOnInit() {
        this.racks.subscribe(result => console.log(result));
    }

    centerMapToUserPosition(): void {
        if(navigator.geolocation) {
            const onSuccess = position => {
                this.mapRef.panTo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                this.mapRef.zoom = this.maxZoom;
                this.userPosition = position;
            };
            const onReject = () => {
                this.mapRef.panTo(this.KyivCenterCoords);
                this.userPosition = null;
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onReject);
        }
    }

    onRackSelect(rack: BikeRack): void {
        this.selectedRack = rack;
        this.mapRef.panTo({
            lat: rack.coords.latitude,
            lng: rack.coords.longitude
        });
    }

    clearRack(): void {
        this.selectedRack = null;
    }

    login(): void {
        this.auth.login().then(credentials => console.log('AUTH', credentials));
    }

}
