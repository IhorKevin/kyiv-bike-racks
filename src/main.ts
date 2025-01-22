import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import {
    FirebaseOptions,
    initializeApp,
    provideFirebaseApp,
} from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { TitleStrategyService } from './app/services';

if (environment.production) {
    enableProdMode();
}

const fireConfig: FirebaseOptions = {
    apiKey: 'AIzaSyDmx2Z2k5nrML8tqjhmH1-hXLH0htKuBsI',
    authDomain: 'kyiv-bike-racks.firebaseapp.com',
    databaseURL: 'https://kyiv-bike-racks.firebaseio.com',
    projectId: 'kyiv-bike-racks',
    storageBucket: 'kyiv-bike-racks.appspot.com',
    messagingSenderId: '508604373840',
    appId: '1:508604373840:web:574cee9c0c89a48965aa55',
    measurementId: 'G-4L7TLKRYXE',
};

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideServiceWorker('ngsw-worker.js', {
            enabled: environment.production,
        }),
        provideAnimationsAsync(),
        provideFirebaseApp(() => initializeApp(fireConfig)),
        provideAuth(() => getAuth()),
        importProvidersFrom(AuthGuardModule),
        provideFirestore(() => getFirestore()),
        provideAnalytics(() => getAnalytics()),
        {
            provide: TitleStrategy,
            useClass: TitleStrategyService,
        },
    ],
}).catch((err) => console.error(err));
