import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {BikeRack} from "../../bike-racks";
import {MatSnackBar} from "@angular/material/snack-bar";
import {firestore} from 'firebase/app';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.styl']
})
export class EditPageComponent implements OnInit {

    rack: BikeRack;

    constructor(private store: AngularFirestore, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

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
        this.store
            .doc<BikeRack>(`/racks/${rack.id}`)
            .update(rack)
            .then(() => {
                this.snackBar.open('Велопарковку збережено', 'OK', {duration: 3000});
                this.router.navigate(['/racks'], {queryParams: {
                        rack_id: rack.id
                    }});
            })
            .catch((error: firestore.FirestoreError) => {
                this.snackBar.open(error.message, 'OK', {duration: 3000});
            })
    }

}
