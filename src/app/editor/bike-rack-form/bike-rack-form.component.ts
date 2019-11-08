import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/firestore";
import {Router} from "@angular/router";
import {BikeRack} from "../../bike-racks";

@Component({
    selector: 'app-bike-rack-form',
    templateUrl: './bike-rack-form.component.html',
    styleUrls: ['./bike-rack-form.component.styl']
})
export class BikeRackFormComponent implements OnInit {

    form: FormGroup;

    constructor(private fb: FormBuilder, private fs: AngularFirestore, private router: Router) { }

    ngOnInit() {
        this.buildForm();
    }

    submit(): void {
        if(this.form.valid) {
            const payload: BikeRack = {
                ...this.form.value
            };
            this.create(payload);
        }
    }

    private buildForm(): void {
        this.form = this.fb.group({
            name: '',
            latitude: [50.449834, Validators.required],
            longitude: [30.523799, Validators.required],
            capacity: 0
        });
    }

    private create(rack: BikeRack): void {
        this.fs.collection<BikeRack>('/racks')
            .add(rack)
            .then(result => {
                console.log('SAVED ITEM', result);
                this.router.navigate(['/racks']);
            })
            .catch(error => {
                console.log('ERROR HAPPEN', error);
            })
    }

}
