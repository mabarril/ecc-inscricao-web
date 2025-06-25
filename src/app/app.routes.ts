import { Routes } from '@angular/router';
import { InscricaoForm } from './components/inscricao-form/inscricao-form';

export const routes: Routes = [
    // {
    //     path: '', component: InscricaoForm      
        
    // },
    {
        path: 'inscricao/:token',  component: InscricaoForm
    }
];
