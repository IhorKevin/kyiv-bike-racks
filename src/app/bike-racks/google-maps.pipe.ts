import { Pipe, PipeTransform } from '@angular/core';
import { firestore } from 'firebase/app';

@Pipe({
    name: 'googleMaps'
})
export class GoogleMapsPipe implements PipeTransform {

    private readonly host: string = 'google.com/maps';

    transform(value: firestore.GeoPoint, ...args: any[]): string {
        if(!value) return '';
        const lat = value.latitude;
        const lng = value.longitude;
        return `//${this.host}/dir/?api=1&destination=${lat},${lng}`;
    }

}
