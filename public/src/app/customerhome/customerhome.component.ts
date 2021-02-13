import { Component, OnInit } from '@angular/core';
import {HttpService} from './../http.service';
import{Router, ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-customerhome',
  templateUrl: './customerhome.component.html',
  styleUrls: ['./customerhome.component.css']
})
export class CustomerhomeComponent implements OnInit {
  customer: any;
  error: any;
  constructor(
    private _httpService :  HttpService,
    private _route : ActivatedRoute,
    private _router : Router,
  ) { }

  ngOnInit() {
    this.findCustomer()
  }

  findCustomer(){ 
    this._httpService.getLoggedInCustomer().subscribe(customer=>{
      this.customer = customer
      this.customer = this.customer.customer
      console.log("found customer in customerhome: "+this.customer)
    })
  }

}
