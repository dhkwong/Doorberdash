import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-restaurantloginreg',
  templateUrl: './restaurantloginreg.component.html',
  styleUrls: ['./restaurantloginreg.component.css']
})
export class RestaurantloginregComponent implements OnInit {
  replyerrors: any
  
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    console.log("login data username: " + form.value.username)
    console.log("login data password: " + form.value.password)
    // console.log("formvalue: "+ form.value.toJSON())
    let formvalue = form.value;
    // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
    this._httpService.restaurantLogin(formvalue)
    .subscribe(data => {
      //login fails
      if (JSON.stringify(data) === '{"login":false}') {
      console.log("subscribe login data: " + JSON.stringify(data))
      this._router.navigate(['/restaurantloginreg'])
      }else{
        //login succeeds
        console.log("subscribe login data: " + JSON.stringify(data))
        this._router.navigate(['/restaurant/home'])
      }
    },
    error=>{
      this._router.navigate(['/restaurant/login']);
    }
    )
  }
  
  register(formvalue: NgForm) {
<<<<<<< HEAD
    console.log("Register Stringify data: " + JSON.stringify(formvalue.value))
    //backend validation working
    this._httpService.restaurantRegister(formvalue.value)
      .subscribe(data => {

        console.log("data: "+JSON.stringify(data))
        if(data!==null){
          this._router.navigate(['/restaurant/home'])
=======
    console.log("Register Stringify data passing to API: " + formvalue.value)
    // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
    //may have to modify this as our backend may not login during registration
    this._httpService.restaurantRegister(formvalue.value)
      .subscribe(data => {

        // let loginresponse = data['login']
        //if registration
        // if (loginresponse != true ){
        //   //if no user found
        //   console.log('registration failed: '+loginresponse)
        //   //store error 
        //   this.replyerrors = loginresponse
          // this._router.navigate(['/restaurant/login'])
        // }
        if(data===null){
          console.log('registration failed')
          this._router.navigate(['/restaurant/login'])
        }
         else {
          //else user found reroute to home
          console.log({data:JSON.stringify(data)})
          console.log("register in login.component navigating to /home")
          this._router.navigate(['/restaurant/home']);
>>>>>>> 27aa05ac200fe625e098745dbc6805a222dee94d
        }
        // let loginresponse = data['login']
        // //if registration
        // if (loginresponse != true ){
        //   //if no user found
        //   console.log('registration failed: '+loginresponse)
        //   //store error 
        //   this.replyerrors = loginresponse
        //   this._router.navigate(['/login'])
        // }
        //  else {
        //   //else user found reroute to home
        //   console.log("register in login.component navigating to /home")
        //   this._router.navigate(['/customer/home']);
        // }
      },
        //if error reroute to login
<<<<<<< HEAD
        error => {
          console.log(error.message)
          this._router.navigate(['/restaurant/login'])
=======
        (error) => {
          /**
           * 
           * 
           * Working here
           * ERROR: we get the token. it's being created as is the restaurant. We just get a token error
           * 
           * 
           */
          
            console.log(formvalue)
            console.log("error in register for restaurantloginreg: "+JSON.stringify(error));
            this._router.navigate(['login'])
          
>>>>>>> 27aa05ac200fe625e098745dbc6805a222dee94d
        }
  
      );
  }
  
  
  }
