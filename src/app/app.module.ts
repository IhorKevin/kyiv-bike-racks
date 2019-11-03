import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBbP5iLdeUARlMMLUaU9MNs6Tres9S6USA'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
