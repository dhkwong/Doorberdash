import { Component, OnInit } from '@angular/core';
import {HttpService} from './../http.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customerloginreg',
  templateUrl: './customerloginreg.component.html',
  styleUrls: ['./customerloginreg.component.css']
})
export class CustomerloginregComponent implements OnInit {
  replyerrors: any;
  
  constructor(
    private _httpService: HttpService,
    private _route:ActivatedRoute,
    private _router: Router
    ) {}

  ngOnInit() {
  }

  login(form: NgForm) {
  console.log("login data username: " + form.value.username)
  console.log("login data password: " + form.value.password)
  // console.log("formvalue: "+ form.value.toJSON())
  let formvalue = form.value;
  // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
  this._httpService.customerLogin(formvalue)
  .subscribe(data => {
    if (JSON.stringify(data) === '{"login":false}') {
    console.log("subscribe login data: " + JSON.stringify(data))
    this._router.navigate(['/login'])
    }else{
      console.log("subscribe login data: " + JSON.stringify(data))
      this._router.navigate(['/home'])
    }
  },
  error=>{
    this._router.navigate(['/login']);
  }
  )
}

register(formvalue: NgForm) {
  console.log("Register Stringify data: " + JSON.stringify(formvalue.value))
  // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
  this._httpService.customerRegister(formvalue.value)
    .subscribe(data => {
      
      let loginresponse = data['login']
      //if registration
      if (loginresponse != true ){
        //if no user found
        console.log('registration failed: '+loginresponse)
        //store error 
        this.replyerrors = loginresponse
        this._router.navigate(['/login'])
      }
       else {
        //else user found reroute to home
        console.log("register in login.component navigating to /home")
        this._router.navigate(['/customer/home']);
      }
    },
      //if error reroute to login
      error => {
        console.log(error.message)
        this._router.navigate(['/customerloginreg'])
      }

    );
}

}



// constructor(private _httpService: HttpService,
//   private _route: ActivatedRoute,
//   private _router: Router, ) { }

// ngOnInit() {
// }

// login(form: NgForm) {
//   console.log("login data username: " + form.value.username)
//   console.log("login data password: " + form.value.password)
//   let formvalue = form.value;
//   // console.log("formvalue: "+ form)

//   // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
//   this._httpService.loginUser(formvalue)
//   .subscribe(data => {
//     if (JSON.stringify(data) === '{"login":false}') {
//     console.log("subscribe login data: " + JSON.stringify(data))
//     this._router.navigate(['/login'])
//     }else{
//       console.log("subscribe login data: " + JSON.stringify(data))
//       this._router.navigate(['/home'])
//     }
//   },
//   error=>{
//     this._router.navigate(['/login']);
//   }
//   )
// }
// register(formvalue: NgForm) {
//   console.log("Register Stringify data: " + JSON.stringify(formvalue.value))
//   // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
//   this._httpService.registerUser(formvalue.value)
//     .subscribe(data => {
//       // currently possible login validation responses data = {login: "true, false, or Username or Password cannot be blank"}
//       let loginresponse = data['login']
//       //if registration
//       if (loginresponse != true ){
//         //if no user found
//         console.log('registration failed: '+loginresponse)
//         //store error 
//         this.replyerrors = loginresponse
//         this._router.navigate(['/login'])
//       }
//        else {
//         //else user found reroute to home
//         console.log("register in login.component navigating to /home")
//         this._router.navigate(['/home']);
//       }
//     },
//       //if error reroute to login
//       error => {
//         console.log(error.message)
//         this._router.navigate(['/login'])
//       }

//     );
// }

// }
