import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceModule } from './services/service.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NoPageFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    PagesModule,],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
