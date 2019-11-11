import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GeoService {

    constructor() { }

    getUserPosition(options?: PositionOptions): Promise<Position> {
        return new Promise((resolve, reject) => {
            if(!navigator.geolocation) reject(new Error('Пристрій не підтримує геологацію'));
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    static readonly KyivCenterCoords: google.maps.LatLngLiteral = {
        lat: 50.449834,
        lng: 30.523799
    };
}
