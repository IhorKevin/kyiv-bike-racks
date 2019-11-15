import { Component, OnInit } from '@angular/core';
import {firestore} from 'firebase/app';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/firestore";
import {BikeRack} from "../../bike-racks";
import {GeoService} from "../../services";

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.styl']
})
export class CreatePageComponent implements OnInit {

    initialRack: BikeRack;

    constructor(
        private geoService: GeoService,
        private snackBar: MatSnackBar,
        private router: Router,
        private store: AngularFirestore
    ) { }

    ngOnInit() {
        this.geoService
            .getUserPosition()
            .then(position => {
                this.initialRack = {
                    coords: new firestore.GeoPoint(position.coords.latitude, position.coords.longitude),
                    created_at: null
                };
            })
            .catch((error: PositionError) => {
                const message = error.code == error.PERMISSION_DENIED ? 'Дозвольте сайту отримати ваше місце знаходження, щоб додавати велопарковки на карту' : error.message;
                this.snackBar.open(message, null, {duration: 5000});
                this.initialRack = {
                    coords: new firestore.GeoPoint(GeoService.KyivCenterCoords.lat, GeoService.KyivCenterCoords.lng),
                    created_at: null
                };
            });
    }

    save(rack: BikeRack): void {
        this.store.collection<BikeRack>('/racks')
            .add(rack)
            .then(result => {
                this.snackBar.open('Велопарковку збережено', 'OK', {duration: 3000});
                this.router.navigate(['/racks'], {queryParams: {
                    rack_id: result.id
                }});
            })
            .catch((error: firestore.FirestoreError) => {
                this.snackBar.open(error.message, 'OK', {duration: 3000});
            })
    }

}