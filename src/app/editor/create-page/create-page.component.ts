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
        private firestore: AngularFirestore
    ) { }

    ngOnInit() {
        this.geoService
            .getUserPosition()
            .then(position => {
                this.initialRack = {
                    coords: new firestore.GeoPoint(position.coords.latitude, position.coords.longitude)
                };
            })
            .catch(error => {
                this.initialRack = {
                    coords: new firestore.GeoPoint(GeoService.KyivCenterCoords.lat, GeoService.KyivCenterCoords.lng)
                };
            });
    }

    save(rack: BikeRack): void {
        this.firestore.collection<BikeRack>('/racks')
            .add(rack)
            .then(result => {
                this.snackBar.open('Велопарковку збережено', 'OK', {duration: 3000});
                this.router.navigate(['/racks']);
            })
            .catch(error => {
                console.log('ERROR HAPPEN', error);
                this.snackBar.open(error, 'OK', {duration: 3000});
            })
    }

}
