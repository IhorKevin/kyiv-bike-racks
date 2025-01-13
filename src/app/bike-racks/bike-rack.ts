import firebase from 'firebase/compat/app';

export interface BikeRack {
    id?: string;
    coords: firebase.firestore.GeoPoint;
    readonly created_at: firebase.firestore.Timestamp;
    capacity?: number;
    photo?: string;
    title?: string;
    street_address?: string;
    owner_name?: string;
    is_private?: boolean;
    is_sheffield?: boolean;
}
