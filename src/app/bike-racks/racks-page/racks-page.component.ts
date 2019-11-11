import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {BikeRack} from "../bike-rack";
import {AuthService} from "../../auth/auth.service";
import {GeoService} from "../../services";

@Component({
    selector: 'app-racks-page',
    templateUrl: './racks-page.component.html',
    styleUrls: ['./racks-page.component.styl']
})
export class RacksPageComponent implements OnInit, AfterViewInit {

    userPosition: Position;
    zoom: number = 15;

    mapOptions: google.maps.MapOptions;

    userMarkerOptions: google.maps.MarkerOptions = {
        icon: '/assets/map-markers/user-location.svg',
        visible: true,
        clickable: false
    };

    rackMarkerOptions: google.maps.MarkerOptions = {
        icon: '/assets/map-markers/rack-marker-default.png',
        visible: true
    };

    racks: Observable<BikeRack[]>;
    selectedRack: BikeRack;
    isLoggedIn: Observable<boolean>;

    @ViewChild(GoogleMap) mapRef: GoogleMap;

    private readonly minZoom = 11;
    private readonly maxZoom = 19;

    constructor(private auth: AuthService, private fs: AngularFirestore, private geoService: GeoService) {
        this.mapOptions = {
            center: GeoService.KyivCenterCoords,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            streetViewControl: false,
            fullscreenControl: false,
            panControl: true,
            mapTypeControl: false
        };
        this.racks = this.fs.collection<BikeRack>('/racks').valueChanges({idField: 'id'});
        this.isLoggedIn = this.auth.isAuthenticated();
    }

    ngOnInit() {
        this.racks.subscribe(result => console.log(result));
    }

    ngAfterViewInit(): void {
        // todo: need improvement
        const button = document.getElementById('location-button');
        this.mapRef.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button);
    }

    centerMapToUserPosition(): void {
        const onSuccess = position => {
            this.mapRef.panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            this.mapRef.zoom = this.maxZoom;
            this.userPosition = position;
        };
        const onReject = () => {
            this.mapRef.panTo(GeoService.KyivCenterCoords);
            this.userPosition = null;
        };
        this.geoService
            .getUserPosition()
            .then(onSuccess)
            .catch(onReject);
    }

    onRackSelect(rack: BikeRack): void {
        this.selectedRack = rack;
        this.mapRef.panTo({
            lat: rack.coords.latitude,
            lng: rack.coords.longitude
        });
    }

    clearRack(event: google.maps.MouseEvent| google.maps.IconMouseEvent): void {
        this.selectedRack = null;
    }

    logout(): void {
        this.auth.logout().then(() => this.mapRef.panTo({lat: GeoService.KyivCenterCoords.lat, lng: GeoService.KyivCenterCoords.lng}));
    }

}
