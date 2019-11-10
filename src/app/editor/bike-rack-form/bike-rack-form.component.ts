import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";
import {Router} from "@angular/router";
import {BikeRack} from "../../bike-racks";
import { firestore } from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-bike-rack-form',
    templateUrl: './bike-rack-form.component.html',
    styleUrls: ['./bike-rack-form.component.styl']
})
export class BikeRackFormComponent implements OnInit {

    form: FormGroup;
    uploadPercent: number;
    previewSrc: string;
    private file: File;

    constructor(
        private fb: FormBuilder,
        private fs: AngularFirestore,
        private firestorage: AngularFireStorage,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.buildForm();
        const geocoder = new google.maps.Geocoder();
        const onGeocode = (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            console.log('RESULTS', results);
            console.log('STATUS', status);
        };
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

    private upload(): void {
        if(this.file) {
            const path: string = `/racks-photo/${this.file.name}`;
            const task: AngularFireUploadTask = this.firestorage.upload(path, this.file);
            task.percentageChanges().subscribe(percentage => this.uploadPercent = percentage);
            task.then(snapshot => {
                this.uploadPercent = null;
                this.file = null;
                snapshot.ref.getDownloadURL().then(url => console.log('IMAGE', url));
            });
        }
    }

}
