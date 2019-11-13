import {
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
import {GoogleMap} from "@angular/google-maps";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {debounceTime, takeUntil} from "rxjs/operators";
import {firestore} from 'firebase/app';
import {BikeRack} from "../../bike-racks";

const latitudeMin = -90;
const latitudeMax = 90;
const longitudeMin = -180;
const longitudeMax = 180;

@Component({
    selector: 'app-bike-rack-form',
    templateUrl: './bike-rack-form.component.html',
    styleUrls: ['./bike-rack-form.component.styl'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeRackFormComponent implements OnInit, OnDestroy {

    form: FormGroup;
    uploadPercent: Observable<number>;
    previewSrc: BehaviorSubject<string>;
    mapOptions: google.maps.MapOptions;
    isDisabled: boolean;
    private file: File;
    private rackLocation: Subject<google.maps.LatLng>;
    private destroy: Subject<void>;

    @Input() rack: BikeRack;
    @Output() save: EventEmitter<BikeRack>;
    @ViewChild(GoogleMap) mapRef: GoogleMap;

    constructor(
        private fb: FormBuilder,
        private firestorage: AngularFireStorage,
        private router: Router
    ) {
        this.save = new EventEmitter();
        this.previewSrc = new BehaviorSubject<string>('');
        this.rackLocation = new Subject();
        this.destroy = new Subject();
    }

    ngOnInit() {
        this.mapOptions = {
            center: {
                lat: this.rack.coords.latitude,
                lng: this.rack.coords.longitude
            },
            minZoom: 11,
            maxZoom: 19,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false
        };
        this.buildForm(this.rack);
        if(this.rack.photo) this.previewSrc.next(this.rack.photo);
        const geocoder = new google.maps.Geocoder();
        const onGeocode = (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            console.log('RESULTS', results);
            console.log('STATUS', status);
        };
    }

    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
        this.previewSrc.complete();
    }

    submit(): void {
        if(this.form.valid) {
            this.isDisabled = true;
            this.form.disable();
            const payload: BikeRack = {
                coords: new firestore.GeoPoint(this.form.value.latitude, this.form.value.longitude),
                created_at: this.rack.created_at || firestore.Timestamp.now(),
                title: this.form.value.title
            };
            if(this.form.value.capacity > 0) payload.capacity = this.form.value.capacity;
            if(this.file) {
                this.uploadPhoto(this.file).then(url => {
                    payload.photo = url;
                    this.save.emit(payload);
                });
            }
            else this.save.emit(payload);
        }
        else {
            this.form.enable();
            this.form.markAllAsTouched();
        }
    }

    cancel(): void {
        this.router.navigate(['/racks']);
    }

    onFileChange(input: HTMLInputElement): void {
        if(input.files.length) {
            this.file = input.files.item(0);
            const reader = new FileReader();
            reader.addEventListener('load', event => {
                this.previewSrc.next(event.target.result.toString());
            });
            reader.readAsDataURL(this.file);
        }
    }

    updateLocation(): void {
        if(!this.form || !this.mapRef) return;
        this.rackLocation.next(this.mapRef.getCenter());
    }

    incrementCapacity(): void {
        const control = this.form.get('capacity');
        control.patchValue(control.value + 1);
    }

    decrementCapacity(): void {
        const control = this.form.get('capacity');
        const value: number = control.value;
        if(value > 0) {
            control.patchValue(value - 1);
        }
    }

    private buildForm(r: BikeRack): void {
        this.form = this.fb.group({
            latitude: [r.coords.latitude, Validators.compose([
                Validators.required,
                Validators.min(latitudeMin),
                Validators.max(latitudeMax)
            ])],
            longitude: [r.coords.longitude, Validators.compose([
                Validators.required,
                Validators.min(longitudeMin),
                Validators.max(longitudeMax)
            ])],
            capacity: [r.capacity || 0, Validators.min(0)],
            title: [r.title, Validators.maxLength(64)],
            street_address: r.street_address || '',
            owner_name: r.owner_name || ''
        });

        this.rackLocation
            .asObservable()
            .pipe(debounceTime(300), takeUntil(this.destroy))
            .subscribe(center => {
                this.form.get('latitude').patchValue(center.lat());
                this.form.get('longitude').patchValue(center.lng());
            });
    }

    private uploadPhoto(file: File): Promise<string> {
        const name = `${this.form.value.latitude}_${this.form.value.longitude}`;
        const extension = file.name.split('.').pop() || '.jpg';
        const path: string = `/racks-photo/original/${name}.${extension}`;
        const task: AngularFireUploadTask = this.firestorage.upload(path, file);
        this.uploadPercent = task.percentageChanges();
        return task
            .then(snapshot => {
                this.file = null;
                return snapshot.ref.getDownloadURL();
            })
            .then(url => {
                return url.replace('original', '1280');
            });
    }

}
