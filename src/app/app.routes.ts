import { Routes } from '@angular/router';
import { HeroComponent } from './landing/hero/hero.component';
import { FormInscriptionComponent } from './form-inscription/form-inscription.component';
import { FormConnexionComponent } from './form-connexion/form-connexion.component';
import { HomeComponent } from './main/home/home.component';
import { ContentHomeComponent } from './main/content-home/content-home.component';
import { FormInscriptionDevComponent } from './dev/form-inscription-dev/form-inscription-dev.component';
import { DashboardComponent } from './dev/dashboard/dashboard.component';
import { HomeDevComponent } from './dev/home/home-dev.component';
import { NotFoundComponent } from './404/not-found.component';
import { devGuard } from './shared/dev.guard';
import { userGuard } from './shared/user.guard';
import { CategoryGamesComponent } from './main/category-games/category-games.component';
import { DetailGameComponent } from './main/detail-game/detail-game.component';
import { ProfilComponent } from './user/profil/profil.component';
import { ProfilStudioComponent } from './main/profil-studio/profil-studio.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


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
        path: 'dev-inscription',
        component: FormInscriptionDevComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path:'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        // canActivate: [userGuard],
        children: [
            {
                path: '',
                component: ContentHomeComponent,
                // canActivate: [userGuard]
            },
            {
                path: 'categories',
                component: CategoryGamesComponent,
                // canActivate: [userGuard]
            },
            {
                path: 'games/:id',
                component: DetailGameComponent,
                // canActivate: [userGuard]
            },
            {
                path: 'profile/:id',
                component: ProfilComponent,
                canActivate: [userGuard],
            },
            {
                path: 'profile-studio/:id',
                component: ProfilStudioComponent,
                canActivate: [userGuard]
            }
        ]
    },
    {
        path: 'dashboard-dev',
        component: DashboardComponent,
        canActivate: [devGuard],
        children: [
            {
                path: '',
                component: HomeDevComponent,
                canActivate: [devGuard]
            }
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
