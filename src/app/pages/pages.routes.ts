import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../services/guards/auth.guard';

/* rutas v2 */
const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        data: { titulo: 'Dashboard' },
        loadChildren: () => import('./child-routes.module').then(m => m.ChildRoutesModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule]
})

export class PagesRoutingModule { }