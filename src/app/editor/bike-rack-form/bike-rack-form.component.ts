import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar';
import {GoogleMap} from "@angular/google-maps";
import {Subject} from "rxjs";
import {debounceTime, takeUntil} from "rxjs/operators";
import {firestore} from 'firebase/app';
import {BikeRack} from "../../bike-racks";
import {GeoService} from "../../services";

@Component({
    selector: 'app-bike-rack-form',
    templateUrl: './bike-rack-form.component.html',
    styleUrls: ['./bike-rack-form.component.styl'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeRackFormComponent implements OnInit, AfterViewInit, OnDestroy {

    form: FormGroup;
    uploadPercent: number;
    previewSrc: string;
    mapCenter: google.maps.LatLngLiteral;
    mapOptions: google.maps.MapOptions;
    position: Position;
    private file: File;
    private rackLocation: Subject<google.maps.LatLng>;
    private destroy: Subject<void>;

    @Input() rack: BikeRack;
    @Output() save: EventEmitter<BikeRack>;
    @ViewChild(GoogleMap) mapRef: GoogleMap;

    constructor(
        private fb: FormBuilder,
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
        this.save = new EventEmitter();
        this.rackLocation = new Subject();
        this.destroy = new Subject();
    }

    ngOnInit() {
        this.buildForm(this.rack);
        const geocoder = new google.maps.Geocoder();
        const onGeocode = (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            console.log('RESULTS', results);
            console.log('STATUS', status);
        };
    }

    ngAfterViewInit(): void {
        this.mapRef.panTo({
            lat: this.rack.coords.latitude,
            lng: this.rack.coords.longitude
        });
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
                const extension = this.file.name.split('.').pop() || '.jpg';
                const name = `${payload.coords.latitude}_${payload.coords.longitude}`;
                const path: string = `/racks-photo/original/${name}.${extension}`;
                const task: AngularFireUploadTask = this.firestorage.upload(path, this.file);
                task.percentageChanges().subscribe(percentage => this.uploadPercent = percentage);
                task.then(snapshot => {
                    this.uploadPercent = null;
                    this.file = null;
                    snapshot.ref.getDownloadURL().then(url => {
                        payload.photo = url;
                        this.save.emit(payload);
                    });
                });
            }
            else this.save.emit(payload);
        }
        else this.form.markAllAsTouched();
    }

    cancel(): void {
        this.router.navigate(['/racks']);
    }

    onFileChange(input: HTMLInputElement): void {
        if(input.files.length) {
            this.file = input.files.item(0);
            const reader = new FileReader();
            reader.addEventListener('load', event => {
                this.previewSrc = event.target.result.toString();
            });
            reader.readAsDataURL(this.file);
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

    private buildForm(r: BikeRack): void {
        this.form = this.fb.group({
            name: r.name,
            latitude: [r.coords.latitude, Validators.compose([
                Validators.required,
                Validators.min(-90),
                Validators.max(90)
            ])],
            longitude: [r.coords.latitude, Validators.compose([
                Validators.required,
                Validators.min(-180),
                Validators.max(180)
            ])],
            capacity: [r.capacity || 0, Validators.min(0)]
        });

        this.rackLocation
            .asObservable()
            .pipe(debounceTime(300), takeUntil(this.destroy))
            .subscribe(center => {
                this.form.get('latitude').patchValue(center.lat());
                this.form.get('longitude').patchValue(center.lng());
            });
    }

}
