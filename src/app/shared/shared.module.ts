import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { GoogleMapsModule } from '@angular/google-maps';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from '@angular/material/list';

const materialComponents = [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule
];

@NgModule({
    declarations: [],
    imports: [],
    exports: [
        CommonModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireAnalyticsModule,
        GoogleMapsModule,
        ...materialComponents
    ]
})
export class SharedModule { }
