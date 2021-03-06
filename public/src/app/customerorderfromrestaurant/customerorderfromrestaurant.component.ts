import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service'

@Component({
  selector: 'app-customerorderfromrestaurant',
  templateUrl: './customerorderfromrestaurant.component.html',
  styleUrls: ['./customerorderfromrestaurant.component.css']
})
export class CustomerorderfromrestaurantComponent implements OnInit {
  restaurant: any[]
  orders: any={};

  errors: any
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) { }

  ngOnInit() {

    this.getRestaurant()
  }
  getRestaurant() {
    this._route.paramMap.subscribe((params) => {
      let id = params.get('id')
      console.log("restaurant id: " + id)
      //make new backend function, getMenuFromRestaurantById
      this._httpService.getMenuFromRestaurantById(id).subscribe((data: any) => {
        this.restaurant = data.menu
        // this.restaurant = this.restaurant.restaurant

        console.log("data: " + JSON.stringify(data))
      })

    })
  }
  //adds dish to orders, but doesnt add the dish name or check for uniqueness. 
  addDish(dish: any, count: any) {
    console.log("dish: " + dish + " count: " + JSON.stringify(count))
    //do nothing if the orders is 0
    if(count === "0" ) {
      return
    }
    else{
      //check if dish exists
      if (dish in this.orders) {
        this.orders[dish] = parseInt(this.orders[dish])+ parseInt(count)
        console.log("dish pre-existing, new orders: " + JSON.stringify(this.orders))

      } else {
        //else just insert the first instance of the dish with key:value of dishname:1
        this.orders[dish] = parseInt(count)
        console.log("new orders: " + JSON.stringify(this.orders))
      }
    }

    }
    submitOrder(){
      console.log("submitting order: "+this.orders)
      //pass the restaurant ID in the body
    }
}
