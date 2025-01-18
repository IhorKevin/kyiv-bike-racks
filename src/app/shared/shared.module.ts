import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

const materialComponents = [
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
];

@NgModule({
    declarations: [],
    imports: [],
    exports: [CommonModule, GoogleMapsModule, ...materialComponents],
})
export class SharedModule {}
