import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
    },
    {
        path: 'create',
        component: CreatePageComponent,
        title: 'Нова велопарковка',
    },
    {
        path: 'edit/:id',
        component: EditPageComponent,
        title: 'Редагування',
    },
];
