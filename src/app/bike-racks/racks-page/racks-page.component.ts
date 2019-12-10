import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GoogleMap} from "@angular/google-maps";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {switchMap, map, shareReplay} from 'rxjs/operators';
import {BikeRack} from "../bike-rack";
import {AuthService} from "../../auth/auth.service";
import {GeoService, MarkerOptionsSet, MarkersService, RackHint} from "../../services";

@Component({
    selector: 'app-racks-page',
    templateUrl: './racks-page.component.html',
    styleUrls: ['./racks-page.component.styl']
})
export class RacksPageComponent implements OnInit, AfterViewInit {

    userPosition: Position;
    zoom: number = 15;

    mapOptions: google.maps.MapOptions;
    markerOptions: MarkerOptionsSet;

    racks: Observable<BikeRack[]>;
    selectedRack: Observable<BikeRack>;
    isLoggedIn: Observable<boolean>;
    hints: Observable<RackHint[]>;

    @ViewChild(GoogleMap) mapRef: GoogleMap;

    private readonly minZoom = 11;
    private readonly maxZoom = 19;

    constructor(
        private auth: AuthService,
        private store: AngularFirestore,
        private geoService: GeoService,
        private router: Router,
        private route: ActivatedRoute,
        private markersService: MarkersService
    ) {
        this.mapOptions = {
            center: GeoService.KyivCenterCoords,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            streetViewControl: false,
            fullscreenControl: false,
            panControl: false,
            mapTypeControl: false,
            zoomControl: false,
            rotateControl: true,
            clickableIcons: false
        };
        this.racks = this.store
            .collection<BikeRack>('/racks')
            .valueChanges({idField: 'id'})
            .pipe(shareReplay(1));

        this.markerOptions = this.markersService.options();
        this.hints = this.markersService.getHints();
        this.isLoggedIn = this.auth.isAuthenticated();
    }

    ngOnInit() {
        const id = this.route.snapshot.queryParamMap.get('rack_id');
        const center = this.getCenterParam();
        if(!id && center) {
            const coords = center.split(',').map(value => Number(value));
            this.mapOptions.center = {
                lat: coords[0],
                lng: coords[1]
            }
        }
    }

    ngAfterViewInit(): void {

        this.selectedRack = this.route.queryParamMap
            .pipe(map(paramMap => paramMap.get('rack_id')))
            .pipe(switchMap(id => this.store.doc<BikeRack>(`/racks/${id}`).snapshotChanges()))
            .pipe(map(snapshot => {
                const payload = snapshot.payload;
                if(payload.exists)  {
                    this.panToRackWithOffset(payload.data());
                    return {
                        id: payload.id,
                        ...payload.data()
                    };
                }
                else {
                    if(this.getCenterParam()) this.clearRack();
                    return null;
                }
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

    private panToRackWithOffset(rack: BikeRack): void {

        // displays selected marker not in the map center but closer to top of the view
        // calculate 15vh from center of the screen

        const coords = rack.coords;
        const bounds = this.mapRef.getBounds().toJSON();
        const offset = (bounds.north - bounds.south) * 0.15; // 15vh from center

        this.mapRef.panTo({
            lat: coords.latitude - offset,
            lng: coords.longitude
        })
    }

    private getCenterParam():string {
        return this.route.snapshot.queryParamMap.get('center');
    }

}
