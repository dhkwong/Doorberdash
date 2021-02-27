import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {HttpService} from '../http.service'

@Component({
  selector: 'app-customerorderfromrestaurant',
  templateUrl: './customerorderfromrestaurant.component.html',
  styleUrls: ['./customerorderfromrestaurant.component.css']
})
export class CustomerorderfromrestaurantComponent implements OnInit {
  restaurant:any[]
  order:any;

  errors:any
  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _httpService:HttpService
  ) { }

  ngOnInit() {
    this.getRestaurant()
  }
  getRestaurant(){
    this._route.paramMap.subscribe((params)=>{
      let id = params.get('id')
      console.log("restaurant id: "+id)
      //make new backend function, getMenuFromRestaurantById
      this._httpService.getMenuFromRestaurantById(id).subscribe((data:any)=>{
        this.restaurant= data.menu
        // this.restaurant = this.restaurant.restaurant

        console.log("data: "+JSON.stringify(data))
      })

    })
  }
}
