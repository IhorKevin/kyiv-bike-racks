import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MarkerOptionsSet {
    userLocation: google.maps.MarkerOptions;
    hint: google.maps.MarkerOptions;
}

@Injectable({
    providedIn: 'root'
})
export class MarkersService {

    readonly folder: string = '/assets/map-markers/';
    readonly rackMarkersFolder: string = '/assets/rack-markers/';

    constructor(private http: HttpClient) {}

    getHintIcon(): string {
        return this.folder + 'rack-hint.svg';
    }

    getUserLocationIcon(): string {
        return this.folder + 'user-location.svg';
    }

    getRackMarker(type: 'primary' | 'secondary', size: 'lg' | 'sm', state: 'default' | 'active'): google.maps.MarkerOptions {

        let zIndex: number = 1;
        if(type == 'primary') zIndex = 2;
        const isActive = state == 'active';
        if(isActive) zIndex = 3;

        return {
            icon: `${this.rackMarkersFolder}${type}-${size}-${state}.svg`,
            visible: true,
            optimized: true,
            zIndex: zIndex,
            clickable: !isActive
        };
    }

    options(): MarkerOptionsSet {
        return {
            userLocation: {
                icon: this.getUserLocationIcon(),
                visible: true,
                clickable: false,
                optimized: false
            },
            hint: {
                icon: this.getHintIcon(),
                visible: true,
                clickable: false,
                zIndex: 0
            }
        }
    }

}
