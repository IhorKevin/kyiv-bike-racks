import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {BikeRack} from "../../bike-racks";
import {MatSnackBar} from "@angular/material/snack-bar";
import firebase from 'firebase/app';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.styl']
})
export class EditPageComponent implements OnInit {

    rack: BikeRack;

    constructor(
        private store: AngularFirestore, 
        private router: Router, 
        private route: ActivatedRoute, 
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.store.doc<BikeRack>(`/racks/${id}`)
            .valueChanges()
            .subscribe(rack => {
                this.rack = {
                    id: id,
                    ...rack
                };
            });
    }

    save(rack: BikeRack): void {
        const center: string = [rack.coords.latitude, rack.coords.longitude].join(',');
        this.store
            .doc<BikeRack>(`/racks/${rack.id}`)
            .update(rack)
            .then(() => {
                this.snackBar.open('Велопарковку збережено', 'OK', {duration: 3000});
                this.router.navigate(['/racks'], {queryParams: {center}});
            })
            .catch((error: firebase.firestore.FirestoreError) => {
                this.snackBar.open(error.message, 'OK', {duration: 3000});
            })
    }

    back(): void {
        this.router.navigate(['/racks'], {queryParams: {rack_id: this.rack.id}});
    }

}
