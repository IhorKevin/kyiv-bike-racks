import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AngularFireStorageModule} from "@angular/fire/storage";

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
        EditorRoutingModule,
        ReactiveFormsModule,
        AngularFireStorageModule
    ]
})
export class EditorModule { }
