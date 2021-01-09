import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customerloginreg',
  templateUrl: './customerloginreg.component.html',
  styleUrls: ['./customerloginreg.component.css']
})
export class CustomerloginregComponent implements OnInit {
  replyerrors: any;
  //probably use reactive forms OR template driven form template is good for 1-2, reactive is good for many. like registration
  // customer: {
  //   firstname: string,
  //   lastname: string,
  //   address: {
  //     street: string,
  //     city: string,
  //     state: string,
  //     zip: number
  //   },
  //   email: string,
  //   password: string,
  // };
  customer: FormGroup

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    //creates form template for form handling
    this.customer = this.createFormGroup()
  }

  ngOnInit() {

  }
  //currently using this method of formgroup
  createFormGroup() {
    return new FormGroup({
      firstname: new FormControl(''),
      lastname:new FormControl(''),
      address: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        zip: new FormControl(''),
      }),
      email: new FormControl('defaultemail@email.com'),
      password: new FormControl('')
    })
  }
  // createFormGroupWithBuilder(formBuilder: FormBuilder) {
  //   return formBuilder.group({
  //     firstName : '',
  //     lastname : '',
  //     address: formBuilder.group({
  //       street: '',
  //       city: '',
  //       state: '',
  //       zip: ''
  //     }),
  //     email: 'email@email.com',
  //     password: ''
  //   });
  // }
  login(form: NgForm) {
    let formvalue = form.value;
    this._httpService.customerLogin(formvalue)
      .subscribe(data => {
        if (JSON.stringify(data) === '{"login":false}') {
          console.log("subscribe login data: " + JSON.stringify(data))
          this._router.navigate(['/customer//login'])
        } else {
          console.log("subscribe login data: " + JSON.stringify(data))
          this._router.navigate(['/customer/home'])
        }
      },
        error => {
          this._router.navigate(['/customer/login']);
        }
      )
  }

  // register(form: NgForm) {
  //   console.log("login data username: " + form.value.username)
  //   console.log("login data password: " + form.value.password)
  //   this.customer.firstname = form.value.firstname
  //   this.customer.lastname = form.value.lastname
  //   this.customer.address.street = form.value.street
  //   this.customer.address.city = form.value.city
  //   this.customer.address.state = form.value.state
  //   this.customer.address.zip = form.value.zip
  //   this.customer.email = form.value.email
  //   this.customer.password = form.value.password
  //   console.log("Register Stringify data: " + JSON.stringify(this.customer))
  //   // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
  //   this._httpService.customerRegister(this.customer)
  //     .subscribe(data => {

  //       console.log("data: " + JSON.stringify(data))
  //       if (data !== null) {
  //         this._router.navigate(['/customer/home'])
  //       }
  //     },
  //       //if error reroute to login
  //       error => {
  //         console.log(error.message)
  //         //COMMENTING OUT so we can see error messages
  //         // this._router.navigate(['/customer/login'])
  //       }

  //     );
  // }
  register() {
    //theoretically create a shallow copy of the customer values from the form to submit
    const formdata = Object.assign({}, this.customer.value)
    console.log("Register Stringify data: " + JSON.stringify(formdata))
    // console.log("username: " + this.loginUser.username + " Pass: " + this.loginUser.password)
    this._httpService.customerRegister(formdata)
      .subscribe(data => {
        console.log("data: "+JSON.stringify(data))
        if(data['error']!== null){
          this.replyerrors = data['error']
          console.log(this.replyerrors)
          this._router.navigate(['/customer/login'])
          
        }else{
          this._router.navigate(['/customer/home'])
        }
        // console.log("data: " + JSON.stringify(data))
        // if (data !== null) {
        //   this._router.navigate(['/customer/home'])
        // }
      },
        //if error reroute to login
        error => {
          console.log("error object: "+JSON.stringify(error))
          console.log("error in customerloginreg: "+error.message)
          //COMMENTING OUT so we can see error messages
          this._router.navigate(['/customer/login'])
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
