import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routes';

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NoPageFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes),
    PagesRoutingModule,
    AuthRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
