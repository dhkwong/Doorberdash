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
  //   //WORKING get all restaurants
  //   .get('/', restaurants.all)
  //   //WORKING get one restaurant
  //   .get('/:id', restaurants.getOneById)
  //   //WORKING gets all dishes
  //   .get('/:id/dish',restaurants.getDishes)
  //   //TEST get one dish from restaurant
  //   .get('/:id/:did/dish',restaurants.getDish)
  //   //WORKING create a restaurant
  //   .post('/', restaurants.create)
  //   //WORKING update restaurant
  //   .put('/:id', restaurants.update)
  //   //WORKING add dish to restaurant menu
  //   .put('/:id/dish', restaurants.addDish)
  //   //WORKING delete dish from restaurant menu
  //   .delete('/:id/:did/dish',restaurants.deleteDish)
  //   //WORKING delete restaurant
  //   .delete('/:id', restaurants.delete)

  //   /* restaurant customer logic */
  //   //WORKING gets all customers from a restaurant
  //   .get('/:id/customers', restaurants.getCustomers)
  //   //WORKING gets ONE customer from a restaurant
  //   .get('/:id/:cid', restaurants.getCustomer)
  //   //WORKING WORKING adds customer to restaurant
  //   .put('/:id/:cid', restaurants.addCustomer)
  //   //WORKING  deletes one customer from restaurant
  //   .delete('/:id/:cid', restaurants.deleteCustomer)

  //   /* customer orders routes */
  //   //get all orders from customer
  //   .get('/:id/:cid/order', restaurants.getCustomerOrders)
  //   //adds one order to customer final route .put('/:id/:did/:cid/order', restaurants.addOrder) unless you dont need to since front end pulls the dish from the id in the first place
  //   .put('/:id/:cid/order', restaurants.addOrder)
  //   //deletes one order from customer
  //   .delete('/:id/:cid/:did/order/', restaurants.deleteOrder)


//restaurant
  getRestaurant(id:any) {
    console.log("getting one restaurant in http service")
    return this._http.get(`/api/restaurants/${id}`)
  }

  getRestaurants() {
    console.log("getting all restaurants in http service")
    return this._http.get(`/api/restaurants`)
  }
  
  getRestaurantMenu(id:any){
    console.log("getting menu from restaurant in http service")
    return this._http.get(`/api/restaurants/${id}/dish`)
  }

  getDishFromMenu(id:any,did:any){
    console.log("getting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/${did}/dish`)
  }
  deleteDishFromMenu(id:any,did:any){
    console.log("deleting dish from restaurant menu in http service")
    return this._http.get(`/api/restaurants/${id}/${did}/dish`)
  }
//restaurant customer
  getRestaurantCustomer(id:any,cid:any){
    console.log("getting customer from restaurant")
    return this._http.get(`/api/restaurants/${id}/${cid}`)
  }
  addRestaurantCustomer(id:any,cid:any){
    console.log("adding customer to restaurant")
    //null body since cid is used to reference the customer
    return this._http.put(`/api/restaurants/${id}/${cid}`,null)
  }
  deleteRestaurantCustomer(id:any,cid:any){
    console.log("deleting customer from restaurant")
    //null body since cid is used to reference the customer
    return this._http.delete(`/api/restaurants/${id}/${cid}`)
  }

//customer user
  getCustomer(cid:any) {
    console.log("getting one customer in http service")
    return this._http.get(`/api/customers/${cid}`)
  }

  getCustomers(){
    console.log("getting all customers in http service")
    return this._http.get(`/api/customers/`)
  }

}
