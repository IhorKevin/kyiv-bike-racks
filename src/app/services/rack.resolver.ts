import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Firestore, doc, docSnapshots } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { BikeRack } from '../bike-racks';

export const rackResolver: ResolveFn<BikeRack> = (route) => {
    const id = route.queryParamMap.get('rack_id');
    if (!id) return null;

    const firestore = inject(Firestore);

    const docRef = doc(firestore, 'racks', id);

    return docSnapshots(docRef).pipe(
        map((snapshot) => {
            return snapshot.exists() ? (snapshot.data() as BikeRack) : null;
        }),
    );
};
