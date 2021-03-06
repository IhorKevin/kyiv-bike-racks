import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable, of} from "rxjs";
import {BikeRack} from "../bike-racks";
import {map, take} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class RackResolver implements Resolve<BikeRack> {

    constructor(private store: AngularFirestore) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BikeRack> {
        const id = route.queryParamMap.get('rack_id');
        if(id) {
            return this.store
                .doc<BikeRack>(`/racks/${id}`)
                .snapshotChanges()
                .pipe(map(snapshot => snapshot.payload.exists ? snapshot.payload.data() : null))
                .pipe(take(1));
        }
        else return of(null);
    }
}
