import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'//allows http requests for backend
import {CookieService} from 'ngx-cookie-service';
import {TokeninterceptorService} from './tokeninterceptor.service';
//allows us to add to the list of HTTP interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RestauranthomeComponent } from './restauranthome/restauranthome.component';
import { CustomerhomeComponent } from './customerhome/customerhome.component';
import { RegisterComponent } from './register/register.component';
import { CustomerupdateComponent } from './customerupdate/customerupdate.component';
import { RestaurantupdateComponent } from './restaurantupdate/restaurantupdate.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RestauranthomeComponent,
    CustomerhomeComponent,
    RegisterComponent,
    CustomerupdateComponent,
    RestaurantupdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    CookieService,
    //add TokeninterceptorService to the list of HTTP interceptors
    {provide: HTTP_INTERCEPTORS, useClass: TokeninterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
