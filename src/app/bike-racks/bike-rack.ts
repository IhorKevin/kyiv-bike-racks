import { firestore } from 'firebase/app';

export interface BikeRack {
    id?: string;
    name?: string;
    coords: firestore.GeoPoint;
    readonly created_at: firestore.Timestamp;
    capacity?: number;
    photo?: string;
}
