import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc, FirestoreError } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BikeRack } from '../../bike-racks';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

    rack: BikeRack;

    constructor(
        private db: Firestore,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) { }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const docRef = doc(this.db, 'racks', id);
        const snapshot = await getDoc(docRef);
        const rack = snapshot.data() as BikeRack;
        this.rack = {
            id: id,
            ...rack
        };
    }

    save(rack: BikeRack): void {
        const center: string = [rack.coords.latitude, rack.coords.longitude].join(',');

        const docRef = doc(this.db, 'racks', rack.id);

        updateDoc(docRef, { ...rack })
            .then(() => {
                this.snackBar.open('Велопарковку збережено', 'OK', { duration: 3000 });
                this.router.navigate(['/racks'], { queryParams: { center } });
            })
            .catch((error: FirestoreError) => {
                this.snackBar.open(error.message, 'OK', { duration: 3000 });
            });
    }

    back(): void {
        this.router.navigate(['/racks'], { queryParams: { rack_id: this.rack.id } });
    }

}
