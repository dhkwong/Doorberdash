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
  loggedinrestaurant: any
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {

  }
  findRestaurant(){
    this._httpService.getRestaurant().subscribe(restaurant=>{
      this.loggedinrestaurant = restaurant
      console.log(this.loggedinrestaurant)
    })
  }
}
