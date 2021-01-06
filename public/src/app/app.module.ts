import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'//allows http requests for backend
import {CookieService} from 'ngx-cookie-service';
import {TokeninterceptorService} from './tokeninterceptor.service';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
//allows us to add to the list of HTTP interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestauranthomeComponent } from './restauranthome/restauranthome.component';
import { CustomerhomeComponent } from './customerhome/customerhome.component';
import { CustomerupdateComponent } from './customerupdate/customerupdate.component';
import { RestaurantupdateComponent } from './restaurantupdate/restaurantupdate.component';
import { RestaurantloginregComponent } from './restaurantloginreg/restaurantloginreg.component';
import { CustomerloginregComponent } from './customerloginreg/customerloginreg.component';


@NgModule({
  declarations: [
    AppComponent,
    RestauranthomeComponent,
    CustomerhomeComponent,
    CustomerupdateComponent,
    RestaurantupdateComponent,
    RestaurantloginregComponent,
    CustomerloginregComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CookieService,
    //adding TokeninterceptorService to the list of HTTP interceptors
    {provide: HTTP_INTERCEPTORS, useClass: TokeninterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
