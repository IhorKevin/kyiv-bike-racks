import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule, FirebaseOptions} from '@angular/fire';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFirestoreModule} from "@angular/fire/firestore";

const fireConfig: FirebaseOptions = {
    apiKey: "AIzaSyDmx2Z2k5nrML8tqjhmH1-hXLH0htKuBsI",
    authDomain: "kyiv-bike-racks.firebaseapp.com",
    databaseURL: "https://kyiv-bike-racks.firebaseio.com",
    projectId: "kyiv-bike-racks",
    storageBucket: "kyiv-bike-racks.appspot.com",
    messagingSenderId: "508604373840",
    appId: "1:508604373840:web:574cee9c0c89a48965aa55"
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(fireConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
