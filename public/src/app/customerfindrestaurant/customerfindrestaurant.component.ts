import { Component, OnInit } from '@angular/core';
import {HttpService} from './../http.service'
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-customerfindrestaurant',
  templateUrl: './customerfindrestaurant.component.html',
  styleUrls: ['./customerfindrestaurant.component.css']
})
export class CustomerfindrestaurantComponent implements OnInit {
  restaurants: any
  customer: any
  error:any
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }
  ngOnInit() {
    this.getRestaurants()
  }

  getRestaurants(){
    this._httpService.getRestaurants().subscribe(data=>{
      console.log("Got all restaurants to display to customer: "+JSON.stringify(data))
      this.restaurants = data

    })
  }

  logOut(){
    
  }
}
