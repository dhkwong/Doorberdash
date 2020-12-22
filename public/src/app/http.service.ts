import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service'
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http: HttpClient,
    private cookieService: CookieService
  ) { }

  //  Routes in restaurants.routes.js
  //  //currently organized by organize by restaurant, customer, and customer order  THEN by request type. GET, POST, PUT, DELETE.



 /**
  * 
  * 
  * 
  * 
  * 
  * 
  * Login and registration logic for customer and restaurant
  * 
  * 
  * 
  * 
  * 
  */
  //WORKING. Registers restaurant, 
  restaurantRegister(newRestaurant:any){
    console.log('registering restaurant client side')
    return this._http.post('/api/restaurants/restaurantregister',newRestaurant,{
      observe: 'response'
  }).pipe( map((res)=>{
    //WORKING gets headers
    console.log(JSON.stringify("headers: "+JSON.stringify(res.headers.get('JWT'))))
    //may not need to delete header if it doesn't persist to client side
    //can set cookie here optimally or move to restaurantloginreg component
    this.cookieService.set('JWT',res.headers.get('JWT'))
    console.log("testing cookie in httpservice reg:"+JSON.stringify(this.cookieService.get('JWT')))
    //passes response to component
    return res
  }))
    // .pipe(
    // //have to .pipe(map()) in order to modify the response of the http.post request
    // map((res:Response)=>{
    //   let token = res.headers.get('Authorization')
    //   //modify 'jwt tokenvalue' to 'tokenvalue'
    //   token = token.substr(4)
    //   //set cookie jwt value for interceptor to validate upon subsequent requests
    //   this.cookieService.set('JWT',token)
    //   //remove the authorization jwt token header created upon registration and convert to cookie
    //   res.headers.delete('Authorization')
    //   return res
    // })
    // )
  }

  //TESTING logs in restaurant user
  restaurantLogin(loginCredentials: any) {
    console.log('logging in at restaurantLogin client side')
    return this._http.post('/api/restaurants/restaurantlogin', loginCredentials).pipe(
      map((res: Response) => {
        //set jwt cookie
        //may be res.headers.get('Authorization). reference retaurantRegister
        console.log("headerin httpservice restaurantregister: " + res.headers.get('JWT'))
        this.cookieService.set('JWT', res.headers.get('JWT'))
        //remove JWT header. May be .delete('Authorization) 
        res.headers.delete('JWT')
        return res
        // return res.json

      })
    )
  }

  customerRegister(newCustomer: any) {
    console.log('registering customer client side')
    return this._http.post('/api/restaurants/customerregister', newCustomer).pipe(
      //have to .pipe(map()) in order to modify the response of the http.post request
      map((res: Response) => {
        let token = res.headers.get('Authorization')
        //modify 'jwt tokenvalue' to 'tokenvalue'
        token = token.substr(4)
        //set cookie jwt value for interceptor to validate upon subsequent requests
        this.cookieService.set('JWT', token)
        //remove the authorization jwt token header created upon registration and convert to cookie
        res.headers.delete('Authorization')
        //returns response object
        return res
      })
    )
  }

  customerLogin(loginCredentials: any) {
    console.log('logging in at customerLogin client side')
    return this._http.post('/api/customers/customerlogin', loginCredentials).pipe(
      map((res: Response) => {
        //set jwt cookie
        //may be res.headers.get('Authorization). reference cutomerRegister
        this.cookieService.set('JWT', res.headers.get('JWT'))
        //remove JWT header. May be .delete('Authorization) 
        res.headers.delete('JWT')
        return res

      })
    )
  }
  /**
  * 
  * 
  * 
  * 
  * 
  * 
  * restaurant paths
  * 
  * 
  * 
  * 
  * 
  * 
  *
  */
  // get ALL restaurants
  getRestaurants() {
    console.log("getting all restaurants in http service")

    return this._http.get(`/api/restaurants`)
  }
  // get ONE logged in restaurant
  getRestaurant() {
    //header set in tokeninterceptor from cookie for jwt validation
    console.log("getting one restaurant in http service")
    return this._http.get(`/api/restaurants/`)
  }

  // gets ALL dishes on menu from logged in restaurant
  getDishes(id: any) {
    console.log("getting menu from restaurant in http service")
    return this._http.get(`/api/restaurants/${id}/dish`)
  }
  //get ONE dish from restaurant
  getDish(id: any, did: any) {
    console.log("getting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/${did}/dish`)
  }
  // create a restaurant
  //outdated by restaurantRegister
  createRestaurant(newRestaurant: any) {
    console.log("creating restaurant in http service")
    return this._http.get(`/api/restaurants`, newRestaurant)
  }
  // update restaurant
  updateRestaurant(id: any, updatedRestaurant) {
    console.log("getting customer from restaurant")
    return this._http.get(`/api/restaurants/${id}`, updatedRestaurant)
  }
  // add dish to restaurant menu
  addDish(id: any, dish: any) {
    console.log("getting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/dish`, dish)
  }
  // delete dish from restaurant menu
  deleteDish(id: any, did: any) {
    console.log("deleting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/${did}/dish`)
  }
  // delete restaurant
  deleteRestaurant(id: any) {
    console.log("deleting restaurant in http service")
    return this._http.delete(`/api/restaurants/${id}`)
  }


  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * restaurant customer paths
   * 
   * 
   * 
   * 
   * 
   *
   */
  // gets all customers from a restaurant
  getRestaurantCustomers(id: any) {
    console.log("getting customer from restaurant")
    return this._http.get(`/api/restaurants/${id}/customers`)
  }
  // gets ONE customer from a restaurant
  getRestaurantCustomer(id: any, cid: any) {
    console.log("getting customer from restaurant")
    return this._http.get(`/api/restaurants/${id}/${cid}`)
  }
  // adds customer to restaurant
  addRestaurantCustomer(id: any, cid: any) {
    console.log("adding customer to restaurant")
    //null body since cid is used to reference the customer
    return this._http.put(`/api/restaurants/${id}/${cid}`, null)
  }
  //deletes one customer from restaurant
  deleteRestaurantCustomer(id: any, cid: any) {
    console.log("deleting customer from restaurant")
    //null body since cid is used to reference the customer
    return this._http.delete(`/api/restaurants/${id}/${cid}`)
  }


  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * restaurant customer order routes
   * 
   * 
   * 
   * 
   *
   */
  //gets all dishes in customer's order
  getCustomerOrder(id: any, cid: any) {
    console.log("getting customer's orders in http service")
    return this._http.get(`/api/restaurants/${id}/${cid}/order`)
  }
  //adds order to customer's order
  addOrder(id: any, cid: any, dish: any) {
    console.log("adding order to customer in http service")
    return this._http.put(`/api/restaurants/${id}/${cid}/order`, dish)
  }
  //deletes one order from customer
  // could change to pass an array of all orders. If we choose to do so, we need to change to PUT since DELETE does not allow data to be sent in the body of the request. however, I think runtime would be the same, since you'll either iterate through the array on front end, or back end. the difference is simply security 
  deleteOrder(id: any, cid: any, did: any) {
    console.log("deleting order from customer in http service")
    return this._http.delete(`/api/restaurants/${id}/${cid}/${did}/order`)
  }


  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * Customer user paths
   * 
   * 
   * 
   * 
   *
   */
  //gets all customers  
  getCustomers() {
    console.log("getting all customers in http service")
    return this._http.get(`/api/customers/`)
  }
  //gets one customer
  getCustomer(cid: any) {
    console.log("getting one customer in http service")
    return this._http.get(`/api/customers/${cid}`)
  }
  //creates customer
  createCustomer(newCustomer: any) {
    console.log("creating customer in http service")
    return this._http.post(`/api/customers/`, newCustomer)
  }
  //updates customer
  updateCustomer(cid: any, newCustomer: any) {
    console.log("updating customer in http service")
    return this._http.put(`/api/customers/${cid}`, newCustomer)
  }
  //deletes customer
  deleteCustomer(cid: any) {
    console.log("deleting customer in http service")
    return this._http.delete(`/api/customer/${cid}`)
  }

  //logs out any user. Customer or restaurant
  logout() {
    return this.cookieService.delete('JWT')
  }
}
