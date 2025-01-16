import { Pipe, PipeTransform } from '@angular/core';
import type { GeoPoint } from '@angular/fire/firestore';

@Pipe({
    name: 'googleMaps',
})
export class GoogleMapsPipe implements PipeTransform {
    private readonly host: string = 'google.com/maps';

    transform(value: GeoPoint): string {
        if (!value) return '';
        const lat = value.latitude;
        const lng = value.longitude;
        return `//${this.host}/dir/?api=1&destination=${lat},${lng}`;
    }
}
