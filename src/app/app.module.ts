import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import type { FirebaseOptions } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BikeRacksModule } from './bike-racks/bike-racks.module';
import { AuthModule } from './auth/auth.module';

const fireConfig: FirebaseOptions = {
    apiKey: 'AIzaSyDmx2Z2k5nrML8tqjhmH1-hXLH0htKuBsI',
    authDomain: 'kyiv-bike-racks.firebaseapp.com',
    databaseURL: 'https://kyiv-bike-racks.firebaseio.com',
    projectId: 'kyiv-bike-racks',
    storageBucket: 'kyiv-bike-racks.appspot.com',
    messagingSenderId: '508604373840',
    appId: '1:508604373840:web:574cee9c0c89a48965aa55',
    measurementId: 'G-4L7TLKRYXE'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(fireConfig),
        AuthGuardModule,
        provideFirebaseApp(() => initializeApp(fireConfig)),
        provideAuth(() => getAuth()),
        provideAnalytics(() => getAnalytics()),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        BikeRacksModule,
        AuthModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
