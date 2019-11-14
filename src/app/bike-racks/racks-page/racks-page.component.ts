import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Observable, of} from "rxjs";
import {BikeRack} from "../bike-rack";
import {AuthService} from "../../auth/auth.service";
import {GeoService} from "../../services";
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map, tap } from 'rxjs/operators';

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
    selectedRack: Observable<BikeRack>;
    isLoggedIn: Observable<boolean>;

    @ViewChild(GoogleMap) mapRef: GoogleMap;

    private readonly minZoom = 11;
    private readonly maxZoom = 19;

    constructor(
        private auth: AuthService,
        private fs: AngularFirestore,
        private geoService: GeoService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.mapOptions = {
            center: GeoService.KyivCenterCoords,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            streetViewControl: false,
            fullscreenControl: false,
            panControl: false,
            mapTypeControl: false,
            zoomControl: false
        };
        this.racks = this.fs.collection<BikeRack>('/racks').valueChanges({idField: 'id'});
        this.isLoggedIn = this.auth.isAuthenticated();
    }

    ngOnInit() {
        this.racks.subscribe(result => console.log(result));
    }

    ngAfterViewInit(): void {
        this.selectedRack = this.route.queryParamMap
            .pipe(map(paramMap => paramMap.get('rack_id')))
            .pipe(switchMap(id => this.fs.doc<BikeRack>(`/racks/${id}`).snapshotChanges()))
            .pipe(map(snapshot => {
                const payload = snapshot.payload;
                if(payload.exists)  {
                    const coords = payload.data().coords;
                    this.mapRef.panTo({
                        lat: coords.latitude,
                        lng: coords.longitude
                    });
                    return payload.data();
                }
                else {
                    this.clearRack();
                    return null;
                };
            }));
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
        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: {rack_id: rack.id}
        });
    }

    clearRack(event?: google.maps.MouseEvent| google.maps.IconMouseEvent): void {
        this.router.navigate(['.'], {relativeTo: this.route});
    }

    logout(): void {
        this.auth.logout().then(() => this.mapRef.panTo({lat: GeoService.KyivCenterCoords.lat, lng: GeoService.KyivCenterCoords.lng}));
    }

    useCompressedImage(src: string): string {
        if(src) {
            return src.replace('original', '1280');
        }
        else return 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Bike_Parking_Lviv_7.jpg';
    }

}
