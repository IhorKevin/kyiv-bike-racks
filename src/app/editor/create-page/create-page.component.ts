import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, FirestoreError, GeoPoint } from '@angular/fire/firestore';
import { BikeRack } from '../../bike-racks';
import { GeoService } from '../../services';

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

    initialRack: BikeRack;

    constructor(
        private geoService: GeoService,
        private snackBar: MatSnackBar,
        private router: Router,
        private db: Firestore,
    ) { }

    ngOnInit() {
        this.geoService
            .getUserPosition({
                enableHighAccuracy: true,
                maximumAge: 0
            })
            .then(position => {
                this.initialRack = {
                    coords: new GeoPoint(position.coords.latitude, position.coords.longitude),
                    created_at: null
                };
            })
            .catch((error: GeolocationPositionError) => {
                const message = error.code === error.PERMISSION_DENIED ? 'Дозвольте сайту отримати ваше місце знаходження, щоб додавати велопарковки на карту' : error.message;
                this.snackBar.open(message, null, {duration: 5000});
                this.initialRack = {
                    coords: new GeoPoint(GeoService.KyivCenterCoords.lat, GeoService.KyivCenterCoords.lng),
                    created_at: null
                };
            });
    }

    save(rack: BikeRack): void {
        const center: string = [rack.coords.latitude, rack.coords.longitude].join(',');

        const collectionRef = collection(this.db, 'racks');
        addDoc(collectionRef, rack)
            .then(() => {
                this.snackBar.open('Велопарковку збережено', 'OK', { duration: 3000 });
                this.router.navigate(['/racks'], { queryParams: { center } });
            })
            .catch((error: FirestoreError) => {
                this.snackBar.open(error.message, 'OK', { duration: 3000 });
            });
    }

    back(): void {
        this.router.navigate(['/racks']);
    }

}
