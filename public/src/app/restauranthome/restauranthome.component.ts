import { Component, OnInit } from '@angular/core';
import {HttpService} from './../http.service'
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-restauranthome',
  templateUrl: './restauranthome.component.html',
  styleUrls: ['./restauranthome.component.css']
})
export class RestauranthomeComponent implements OnInit {
  restaurant: any
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.findRestaurant()
    
  }
  findRestaurant(){
    this._httpService.getRestaurant().subscribe(restaurant=>{
      this.restaurant = restaurant
      this.restaurant = this.restaurant.restaurant
      console.log("logged in restaurant in restauranthome"+ JSON.stringify(this.restaurant))
    })
  }
}
