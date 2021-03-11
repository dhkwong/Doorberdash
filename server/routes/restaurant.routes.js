const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
// const Restaurant = mongoose.models('Restaurant')
const loginreg = require('./../controllers/loginreg');
const restaurants = require('./../controllers/restaurants');

// require passport for jwt authentication
// const passport = require('passport')

// const ensurelogin = require('connect-ensure-login').ensureLoggedIn


router
  //currently organized by organize by restaurant, customer, and customer order  THEN by request type. GET, POST, PUT, DELETE.
  /* restaurant login/reg and validation logic */
  //route looks like this:
  //localhost:8000/api/restaurants/restaurantregister
  //WORKING
  .post('/restaurantlogin', loginreg.restaurantLogin)
  //logout
  //.post('restaurantlogout',loginreg.restaurantLogout)
  //WORKING
  .post('/restaurantregister', loginreg.restaurantRegister)
  //WORKING finds restaurant through Authorization 'JWT' token in header for id
  .get('/findrestaurant', restaurants.findLoggedInRestaurant)
  .get('/:id/getrestaurantbyid', restaurants.getOneById)

  /* restaurant logic */
  //organize routes by restaurants.js
  //WORKING DOES NOT NEED PASSPORTß get all restaurants
  .get('/', restaurants.all)
  //WORKING WITH PASSPORT gets all dishes
  .get('/getdishes', restaurants.getDishesFromLoggedInRestaurant)
  //WORKING WITH PASSPORT AUTHENTICATION get one dish from restaurant
  .get('/:did/getdish',restaurants.getDishFromLoggedInRestaurant)
  //WORKING WITH PASSPORT has to be BEFORE put /:id since otherwise it reads "dish" as an id
  .put('/dish', restaurants.addDishToLoggedInRestaurant)
  //edits dish in logged in restaurant's menu
  .put('/editdish', restaurants.updateDishInLoggedInRestaurant)
  //adds one dish to logged in restauraunt's menu
  //WORKING WITH PASSPORT update restaurant
  .put('/', restaurants.update)
  //WORKING WITH PASSPORT delete dish from restaurant menu
  .delete('/:did/dish', restaurants.deleteDish)
  //WORKING DOES NOT NEED PASSPORT delete restaurant 
  .delete('/:id', restaurants.delete)

  /* customer orders routes */
  //get all orders from customer
  .get('/:id/:cid/order', restaurants.getCustomerOrders)
  //adds one order to customer
  // .put('/:id/:cid/order', restaurants.addOrder)
  //adds all orders to customer in restaurant
  .put('/order',restaurants.addOrders)
  //better addOrder uses jwt and pulls dish ID from restaurant. uses /:did/getdish logic
  .put('/:cid/:did/order', restaurants.jwtAddOrder)
  //deletes one order from customer
  // .delete('/:id/:cid/:did/order/', restaurants.deleteOrder)
  .delete('/:cid/:did/order', restaurants.deleteOrder)

  /* restaurant customer logic */
  //WORKING gets all customers from a restaurant
  // .get('/:id/customers', restaurants.getCustomers)
  .get('/customers',restaurants.getCustomers)
  //WORKING gets ONE customer from a restaurant
  // .get('/:id/:cid', restaurants.getCustomer)
  .get('/:cid',restaurants.getCustomer)
  //WORKING adds customer to restaurant
  // .put('/:id/:cid', restaurants.addCustomer)
  .put('/:cid', restaurants.addCustomer)
  //WORKING  deletes one customer from restaurant
  // .delete('/:id/:cid', restaurants.deleteCustomer)
  .delete('/:cid/customers',restaurants.deleteCustomer)


module.exports = router;
