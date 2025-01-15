import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { BikeRack } from '../bike-racks';

export const rackResolver: ResolveFn<BikeRack> = (route) => {
    const id = route.queryParamMap.get('rack_id');
    if (!id) return null;

    return inject(AngularFirestore)
        .doc<BikeRack>(`/racks/${id}`)
        .snapshotChanges()
        .pipe(map(snapshot => snapshot.payload.exists ? snapshot.payload.data() : null))
        .pipe(take(1));
};
