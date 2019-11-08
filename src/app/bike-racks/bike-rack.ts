import { firestore } from 'firebase/app';

export interface BikeRack {
    id?: string;
    name?: string;
    coords: firestore.GeoPoint;
    capacity?: number;
}
