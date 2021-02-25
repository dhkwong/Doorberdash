import { ThrowStmt } from '@angular/compiler';
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
  dish:any = {
    name:"",
    description:"",
    time:0
  }
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _httpService: HttpService,

  ) { }

  ngOnInit() {
    this.findLoggedInRestaurant();
  }
  findLoggedInRestaurant(){
    //retrieve restaurant data for logged in restaurant
    this._httpService.getRestaurant().subscribe((data:any)=>{

      this.restaurant = data.restaurant
      console.log("test: "+JSON.stringify(this.restaurant))
      this.menu = this.restaurant.dish
      console.log("menu: "+JSON.stringify(this.menu))
      
    })
  }
  //submits form template variable 
  addDish(form:NgForm){
    let data = JSON.stringify(form.value)
    this._httpService.addDishToRestaurant(form.value).subscribe(data=>{
      window.location.reload()
    })
  }
  deleteDish(did:any){

    this._httpService.deleteDish(did).subscribe( data=>{
      window.location.reload()
    }
      
    )
  }

}
