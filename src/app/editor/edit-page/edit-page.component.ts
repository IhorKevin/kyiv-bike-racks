import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {BikeRack} from "../../bike-racks";

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.styl']
})
export class EditPageComponent implements OnInit {

    rack: BikeRack;

    constructor(private store: AngularFirestore, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.store.doc<BikeRack>(`/racks/${id}`)
            .valueChanges()
            .subscribe(rack => this.rack = rack);
    }

}
