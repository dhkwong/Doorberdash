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
  error:any
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
      // this.restaurant = this.restaurant.restaurant
      console.log("logged in restaurant in restauranthome"+ JSON.stringify(this.restaurant))
    })
  }
  deleteCustomer(id:any){
    this._httpService.deleteRestaurantCustomer(id).subscribe(data=>{
      //mongodb delete returns { "acknowledged" : true, "deletedCount" : 1 }
        if(data[0] === true){
          //quick fix to reload page to update customer data
          window.location.reload();
        }else{
          //error for either deletion error or if jwt token doesnt match during deletion
          this.error = "customer unable to be deleted"
        }
    })
  }
}
