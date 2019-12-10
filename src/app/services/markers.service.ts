import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/operators";

export type RackHint = [number, number];
export interface MarkerOptionsSet {
    userLocation: google.maps.MarkerOptions;
    hint: google.maps.MarkerOptions;
    rack: google.maps.MarkerOptions;
}

@Injectable({
    providedIn: 'root'
})
export class MarkersService {

    readonly folder: string = '/assets/map-markers/';
    private hints: RackHint[];

    constructor(private http: HttpClient) {}

    getHints(): Observable<RackHint[]> {
        if(this.hints) return of(this.hints);
        else return this.http
            .get<RackHint[]>('assets/hints.json')
            .pipe(tap(hints => this.hints = hints));
    }

    getHintIcon(): string {
        return this.folder + 'rack-hint.svg';
    }

    getUserLocationIcon(): string {
        return this.folder + 'user-location.svg';
    }

    getRackIcon(): string {
        return this.folder + 'rack-marker-default.png';
    }

    options(): MarkerOptionsSet {
        return {
            userLocation: {
                icon: this.getUserLocationIcon(),
                visible: true,
                clickable: false
            },
            hint: {
                icon: this.getHintIcon(),
                visible: true,
                clickable: false
            },
            rack: {
                icon: this.getRackIcon(),
                visible: true
            }
        }
    }

}
