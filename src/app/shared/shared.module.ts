import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

const materialComponents = [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
];

@NgModule({
    declarations: [],
    imports: [],
    exports: [CommonModule, GoogleMapsModule, ...materialComponents],
})
export class SharedModule {}
