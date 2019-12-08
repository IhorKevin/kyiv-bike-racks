import { firestore } from 'firebase/app';

export interface BikeRack {
    id?: string;
    coords: firestore.GeoPoint;
    readonly created_at: firestore.Timestamp;
    capacity?: number;
    photo?: string;
    title?: string;
    street_address?: string;
    owner_name?: string;
    is_private?: boolean;
    is_sheffield?: boolean;
}
