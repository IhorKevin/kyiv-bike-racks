import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AngularFireStorageModule} from "@angular/fire/storage";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { EditorRoutingModule } from './editor-routing.module';
import { SharedModule } from "../shared/shared.module";
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
