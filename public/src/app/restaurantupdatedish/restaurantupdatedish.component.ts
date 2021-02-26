import { Component, OnInit } from '@angular/core';
import {HttpService} from './../http.service'
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-restaurantupdatedish',
  templateUrl: './restaurantupdatedish.component.html',
  styleUrls: ['./restaurantupdatedish.component.css']
})
export class RestaurantupdatedishComponent implements OnInit {
  did:any
  dish:any;
  replyerrors:any[];
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getDish()
  }
  getDish(){
    this._route.paramMap.subscribe((params)=>{
      this.did = params.get('did')
      let did = params.get('did')
      console.log("dish id: "+did)
      this._httpService.getDish(did).subscribe(data=>{
        this.dish = data
        this.dish = this.dish.dish
      })

    })
  }

  //TESTING UPDATED LOGGED IN DISH IN RESTAURANTS.JS
  updateDish(form:NgForm){
    this._httpService.updateDishInRestaurant(this.did,form.value).subscribe((data:any)=>{
      console.log("updatedata: "+JSON.stringify(data))
      if(data === true){
        this._router.navigate(['/restaurant/update/menu'])
      }else if(data.error){
        this.replyerrors = data.console.error;
        window.location.reload()
        
      }
    })
  }

}
