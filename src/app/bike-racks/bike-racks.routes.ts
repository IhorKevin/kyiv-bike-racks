import { Routes } from '@angular/router';
import { RacksPageComponent } from './racks-page/racks-page.component';
import { rackResolver } from '../services/rack.resolver';

export const routes: Routes = [
    {
        path: 'racks',
        component: RacksPageComponent,
        data: {
            title: 'Карта',
        },
        resolve: {
            rack: rackResolver,
        },
    },
];
