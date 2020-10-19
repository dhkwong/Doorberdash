import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http: HttpClient
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
   * restaurant paths
   * 
   * 
   * 
   * 
   * 
   * 
   *
   */


  // get all restaurants
  getRestaurants() {
    console.log("getting all restaurants in http service")
    return this._http.get(`/api/restaurants`)
  }
  // get one restaurant
  getRestaurant(id: any) {
    console.log("getting one restaurant in http service")
    return this._http.get(`/api/restaurants/${id}`)
  }
  // gets all dishes
  getDishes(id: any) {
    console.log("getting menu from restaurant in http service")
    return this._http.get(`/api/restaurants/${id}/dish`)
  }
  // TEST get one dish from restaurant
  getDish(id: any, did: any) {
    console.log("getting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/${did}/dish`)
  }
  // create a restaurant
  createRestaurant(newRestaurant: any) {
    console.log("creating restaurant in http service")
    return this._http.get(`/api/restaurants`, newRestaurant)
  }
  // update restaurant
  updateRestaurant(id:any,updatedRestaurant){
    console.log("getting customer from restaurant")
    return this._http.get(`/api/restaurants/${id}`,updatedRestaurant)
  }
  // add dish to restaurant menu
  addDish(id: any, dish: any) {
    console.log("getting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/dish`,dish)
  }
  // delete dish from restaurant menu
  deleteDish(id: any, did: any) {
    console.log("deleting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/${did}/dish`)
  }
  // delete restaurant
  deleteRestaurant(id:any){
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
  deleteOrder(id: any, cid: any,did:any) {
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
  createCustomer(newCustomer:any){
    console.log("creating customer in http service")
    return this._http.post(`/api/customers/`,newCustomer)
  }
  //updates customer
  updateCustomer(cid:any, newCustomer:any){
    console.log("updating customer in http service")
    return this._http.put(`/api/customers/${cid}`,newCustomer)
  }
  //deletes customer
  deleteCustomer(cid:any){
    console.log("deleting customer in http service")
    return this._http.delete(`/api/customer/${cid}`)
  }

}
