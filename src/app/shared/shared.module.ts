import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { GoogleMapsModule } from '@angular/google-maps';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

const materialComponents = [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    MatCheckboxModule
];

@NgModule({
    declarations: [],
    imports: [],
    exports: [
        CommonModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        GoogleMapsModule,
        ...materialComponents
    ]
})
export class SharedModule { }
