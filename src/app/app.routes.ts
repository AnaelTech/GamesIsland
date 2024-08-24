import { Routes } from '@angular/router';
import { HeroComponent } from './landing/hero/hero.component';
import { FormInscriptionComponent } from './form-inscription/form-inscription.component';
import { FormConnexionComponent } from './form-connexion/form-connexion.component';
import { Component } from '@angular/core';
import { HomeComponent } from './main/home/home.component';
import { ContentHomeComponent } from './main/content-home/content-home.component';


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

    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: ContentHomeComponent
            }
        ]
    }
];
