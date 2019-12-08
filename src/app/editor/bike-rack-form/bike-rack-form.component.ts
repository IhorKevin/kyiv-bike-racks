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
    private geocoder: google.maps.Geocoder;

    @Input() rack: BikeRack;
    @Output() save: EventEmitter<BikeRack>;
    @Output() cancel: EventEmitter<void>;
    @ViewChild(GoogleMap) mapRef: GoogleMap;

    constructor(
        private fb: FormBuilder,
        private firestorage: AngularFireStorage
    ) {
        this.save = new EventEmitter();
        this.cancel = new EventEmitter();
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
            mapTypeControl: false,
            clickableIcons: false,
            gestureHandling: "greedy"
        };
        this.buildForm(this.rack);
        if(this.rack.photo) this.previewSrc.next(this.rack.photo);

    }

    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
        this.previewSrc.complete();
    }

    submit(): void {
        if(this.form.valid) {
            this.isDisabled = true;
            const formValue = this.form.value;
            this.form.disable();
            const payload: BikeRack = {
                coords: new firestore.GeoPoint(formValue.latitude, formValue.longitude),
                created_at: this.rack.created_at || firestore.Timestamp.now(),
                capacity: formValue.capacity,
                title: formValue.title,
                street_address: formValue.street_address,
                owner_name: formValue.owner_name,
                is_private: formValue.is_private,
                is_sheffield: formValue.is_sheffield
            };
            if(this.rack.id) payload.id = this.rack.id;
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

    onCancel(): void {
        this.cancel.emit();
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

    defineAddress(): void {
        if(!this.geocoder) this.geocoder = new google.maps.Geocoder();
        const onGeocode = (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if(status == google.maps.GeocoderStatus.OK) {
                const firstResult = results.shift();
                const street_number: string = firstResult.address_components[0].short_name;
                const street_name: string = firstResult.address_components[1].short_name;
                const street_address = [street_name, street_number].join(', ');
                this.form.get('street_address').patchValue(street_address);
            }
        };
        const center = this.mapRef.getCenter();
        const request = {
            location: {
                lat: center.lat(),
                lng: center.lng()
            }
        };
        this.geocoder.geocode(request, onGeocode);
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
            owner_name: r.owner_name || '',
            is_private: r.is_private || false,
            is_sheffield: r.is_sheffield || false
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
                return url.replace('original', 'preview');
            });
    }

}
