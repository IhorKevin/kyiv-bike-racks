import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";
import {Router} from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import {GoogleMap} from "@angular/google-maps";
import {Subject} from "rxjs";
import {debounceTime, takeUntil} from "rxjs/operators";
import { firestore } from 'firebase/app';
import {BikeRack} from "../../bike-racks";
import {GeoService} from "../../services";

@Component({
    selector: 'app-bike-rack-form',
    templateUrl: './bike-rack-form.component.html',
    styleUrls: ['./bike-rack-form.component.styl']
})
export class BikeRackFormComponent implements OnInit, OnDestroy {

    form: FormGroup;
    uploadPercent: number;
    previewSrc: string;
    mapCenter: google.maps.LatLngLiteral;
    mapOptions: google.maps.MapOptions;
    position: Position;
    private file: File;
    private rackLocation: Subject<google.maps.LatLng>;
    private destroy: Subject<void>;

    @ViewChild(GoogleMap) mapRef: GoogleMap;

    constructor(
        private fb: FormBuilder,
        private fs: AngularFirestore,
        private firestorage: AngularFireStorage,
        private router: Router,
        private snackBar: MatSnackBar,
        private geoService: GeoService
    ) {
        this.mapOptions = {
            center: GeoService.KyivCenterCoords,
            minZoom: 11,
            maxZoom: 19,
            streetViewControl: false,
            fullscreenControl: false,
            panControl: false,
            mapTypeControl: false
        };
        this.rackLocation = new Subject();
        this.destroy = new Subject();
    }

    ngOnInit() {

        this.updateUserPosition();
        this.buildForm();
        const geocoder = new google.maps.Geocoder();
        const onGeocode = (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            console.log('RESULTS', results);
            console.log('STATUS', status);
        };
    }

    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
    }

    submit(): void {
        if(this.form.valid) {
            const payload: BikeRack = {
                name: this.form.value.name,
                capacity: this.form.value.capacity,
                coords: new firestore.GeoPoint(this.form.value.latitude, this.form.value.longitude)
            };
            if(this.file) {
                const path: string = `/racks-photo/${this.file.name}`;
                const task: AngularFireUploadTask = this.firestorage.upload(path, this.file);
                task.percentageChanges().subscribe(percentage => this.uploadPercent = percentage);
                task.then(snapshot => {
                    this.uploadPercent = null;
                    this.file = null;
                    snapshot.ref.getDownloadURL().then(url => {
                        payload.photo = url;
                        this.create(payload);
                    });
                });
            }
            else this.create(payload);
        }
    }

    cancel(): void {
        this.router.navigate(['/racks']);
    }

    onFileChange(input: HTMLInputElement): void {
        if(input.files.length) {
            this.file = input.files.item(0);
            this.previewSrc = this.file.name;
        }
        else {
            this.file = null;
            this.previewSrc = null;
        }
    }

    updateLocation(): void {
        if(!this.form || !this.mapRef) return;
        this.rackLocation.next(this.mapRef.getCenter());
    }

    private updateUserPosition(): void {
        this.geoService.getUserPosition()
            .then(position => {
                this.position = position;
                this.mapCenter = {
                    lat: this.position.coords.latitude,
                    lng: this.position.coords.longitude
                };
            })
            .catch(error => {
                this.snackBar.open(error, 'OK', {duration: 3000});
                this.position = null;
            });
    }

    private buildForm(): void {
        this.form = this.fb.group({
            name: '',
            latitude: [50.449834, Validators.compose([
                Validators.required,
                Validators.min(-90),
                Validators.max(90)
            ])],
            longitude: [30.523799, Validators.compose([
                Validators.required,
                Validators.min(-180),
                Validators.max(180)
            ])],
            capacity: [0, Validators.min(0)]
        });

        this.rackLocation
            .asObservable()
            .pipe(debounceTime(300), takeUntil(this.destroy))
            .subscribe(center => {
                this.form.get('latitude').patchValue(center.lat());
                this.form.get('longitude').patchValue(center.lng());
            });
    }

    private create(rack: BikeRack): void {
        this.fs.collection<BikeRack>('/racks')
            .add(rack)
            .then(result => {
                console.log('SAVED ITEM', result);
                this.snackBar.open('Велопарковку збережено', 'OK', {duration: 3000});
                this.router.navigate(['/racks']);
            })
            .catch(error => {
                console.log('ERROR HAPPEN', error);
                this.snackBar.open(error, 'OK', {duration: 3000});
            })
    }

}
