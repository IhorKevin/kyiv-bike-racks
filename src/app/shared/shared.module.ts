import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
    declarations: [],
    imports: [],
    exports: [
        CommonModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        GoogleMapsModule
    ]
})
export class SharedModule { }
