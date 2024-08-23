import { Routes } from '@angular/router';
import { HeroComponent } from './landing/hero/hero.component';
import { FormInscriptionComponent } from './form-inscription/form-inscription.component';
import { FormConnexionComponent } from './form-connexion/form-connexion.component';


export const routes: Routes = [
    {
        path: '',
        component: HeroComponent,
    },
    {
        path: 'inscription',
        component: FormInscriptionComponent
    },
    {
        path: 'connexion',
        component: FormConnexionComponent
    },
];
