import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';

import { EditorRoutingModule } from './editor-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { BikeRackFormComponent } from './bike-rack-form/bike-rack-form.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';


@NgModule({
    declarations: [HomeComponent, BikeRackFormComponent, CreatePageComponent, EditPageComponent],
    imports: [
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
        EditorRoutingModule,
        ReactiveFormsModule,
        AngularFireStorageModule
    ]
})
export class EditorModule { }
