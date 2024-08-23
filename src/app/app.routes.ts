import { Routes } from '@angular/router';
import { HeroComponent } from './landing/hero/hero.component';
import { FormInscriptionComponent } from './form-inscription/form-inscription.component';


export const routes: Routes = [
    {
        path: '',
        component: HeroComponent,
    },
    {
        path: 'inscription',
        component: FormInscriptionComponent
    }
];
