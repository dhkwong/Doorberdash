import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {HttpService} from '../http.service'

@Component({
  selector: 'app-customerorderfromrestaurant',
  templateUrl: './customerorderfromrestaurant.component.html',
  styleUrls: ['./customerorderfromrestaurant.component.css']
})
export class CustomerorderfromrestaurantComponent implements OnInit {
  restaurant:any

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
      this._httpService.getRestaurantById(id).subscribe(data=>{
        this.restaurant = data
        this.restaurant = this.restaurant.restaurant
        console.log(data)
      })

    })
  }
}
