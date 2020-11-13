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
  //WORKING
  .post('/restaurantregister', loginreg.restaurantRegister)
  //WORKING finds restaurant through Authorization 'JWT' token in header for id
  .get('/findrestaurant', restaurants.findLoggedInRestaurant)

  /* restaurant logic */
  //WORKING get all restaurants
  .get('/', restaurants.all)
  //WORKING but outdated by /findrestaurant
  .get('/:id', restaurants.getOneById)
  //WORKING gets all dishes
  .get('/:id/dish', restaurants.getDishes)
  //TEST get one dish from restaurant
  .get('/:id/:did/dish', restaurants.getDish)
  //WORKING create a restaurant
  .post('/', restaurants.create)
  //WORKING has to be BEFORE put /:id since otherwise it reads "dishtest" as an id
  .put('/dish', restaurants.addDishToLoggedInRestaurant)
  //WORKING update restaurant
  .put('/:id', restaurants.update)
  //WORKING add dish to restaurant menu
  // .put('/:id/dish', restaurants.addDish)

  //WORKING delete dish from restaurant menu
  .delete('/:id/:did/dish', restaurants.deleteDish)
  //WORKING delete restaurant
  .delete('/:id', restaurants.delete)


  /* restaurant customer logic */
  //WORKING gets all customers from a restaurant
  .get('/:id/customers', restaurants.getCustomers)
  //WORKING gets ONE customer from a restaurant
  .get('/:id/:cid', restaurants.getCustomer)
  //WORKING WORKING adds customer to restaurant
  .put('/:id/:cid', restaurants.addCustomer)
  //WORKING  deletes one customer from restaurant
  .delete('/:id/:cid', restaurants.deleteCustomer)

  /* customer orders routes */
  //get all orders from customer
  .get('/:id/:cid/order', restaurants.getCustomerOrders)
  //adds one order to customer
  .put('/:id/:cid/order', restaurants.addOrder)
  //deletes one order from customer
  .delete('/:id/:cid/:did/order/', restaurants.deleteOrder)

module.exports = router;
