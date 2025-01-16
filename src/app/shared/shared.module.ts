import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreModule } from '@angular/fire/firestore';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

const materialComponents = [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
];

@NgModule({
    declarations: [],
    imports: [],
    exports: [
        CommonModule,
        FirestoreModule,
        GoogleMapsModule,
        ...materialComponents,
    ],
})
export class SharedModule {}
