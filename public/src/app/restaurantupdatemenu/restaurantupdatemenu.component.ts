import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-restaurantupdatemenu',
  templateUrl: './restaurantupdatemenu.component.html',
  styleUrls: ['./restaurantupdatemenu.component.css']
})
export class RestaurantupdatemenuComponent implements OnInit {
  //double bind restaurant for forms so we can manipulate the restaurant variable through forms
  restaurant:any;
  menu:any[];
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _httpservice: HttpService,

  ) { }

  ngOnInit() {
    this.findLoggedInRestaurant();
  }
  findLoggedInRestaurant(){
    //retrieve restaurant data for logged in restaurant
    this._httpservice.getRestaurant().subscribe((data:any)=>{

      this.restaurant = data.restaurant
      console.log("test: "+JSON.stringify(this.restaurant))
      this.menu = this.restaurant.dish
      console.log("menu: "+typeof this.menu)
      
    })
  }

}
