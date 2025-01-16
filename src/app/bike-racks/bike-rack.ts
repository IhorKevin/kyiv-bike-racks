import type { GeoPoint, Timestamp } from 'firebase/firestore';

export interface BikeRack {
    id?: string;
    coords: GeoPoint;
    readonly created_at: Timestamp;
    capacity?: number;
    photo?: string;
    title?: string;
    street_address?: string;
    owner_name?: string;
    is_private?: boolean;
    is_sheffield?: boolean;
}
