import { Injectable } from '@angular/core';

export interface MarkerOptionsSet {
    userLocation: google.maps.MarkerOptions;
}

@Injectable({
    providedIn: 'root',
})
export class MarkersService {
    readonly folder: string = '/assets/map-markers/';
    readonly rackMarkersFolder: string = '/assets/rack-markers/';

    constructor() {}

    getUserLocationIcon(): string {
        return this.folder + 'user-location.svg';
    }

    getRackMarker(
        type: 'primary' | 'secondary',
        size: 'lg' | 'sm',
        state: 'default' | 'active',
    ): google.maps.MarkerOptions {
        let zIndex: number = 1;
        if (type == 'primary') zIndex = 2;
        const isActive = state == 'active';
        if (isActive) zIndex = 3;

        return {
            icon: `${this.rackMarkersFolder}${type}-${size}-${state}.svg`,
            visible: true,
            optimized: true,
            zIndex: zIndex,
            clickable: !isActive,
        };
    }

    options(): MarkerOptionsSet {
        return {
            userLocation: {
                icon: this.getUserLocationIcon(),
                visible: true,
                clickable: false,
                optimized: false,
            },
        };
    }
}
