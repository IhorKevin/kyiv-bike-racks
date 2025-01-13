import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BikeRack } from '../bike-racks';

@Injectable({
    providedIn: 'root'
})
export class RackResolver implements Resolve<BikeRack> {

    constructor(private store: AngularFirestore) { }

    resolve(route: ActivatedRouteSnapshot): Observable<BikeRack> {
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
