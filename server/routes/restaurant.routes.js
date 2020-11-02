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
    //WORKING get all restaurants
    .get('/', restaurants.all)
    //route looks like this:
    //localhost:8000/api/restaurants/restaurantregister
    //WORKING
    .post('/restaurantlogin',loginreg.restaurantLogin)
    //WORKING
    .post('/restaurantregister',loginreg.restaurantRegister)
    .post('/customerlogin', loginreg.customerLogin)
    .post('/customerregister',loginreg.customerRegister)

    //dont need to pass in /:tokenid since the token is stored within req.header
    .get('/findrestaurant/', restaurants.findLoggedInRestaurant)
    
    //WORKING get one restaurant, uses passport require('connect-ensure-login').ensureLoggedIn to verify login
    .get('/:id',restaurants.getOneById)

    //WORKING gets all dishes
    .get('/:id/dish', restaurants.getDishes)
    //TEST get one dish from restaurant
    .get('/:id/:did/dish', restaurants.getDish)
    //WORKING create a restaurant
    .post('/', restaurants.create)
    //WORKING update restaurant
    .put('/:id', restaurants.update)
    //WORKING add dish to restaurant menu
    .put('/:id/dish', restaurants.addDish)
    //WORKING delete dish from restaurant menu
    .delete('/:id/:did/dish', restaurants.deleteDish)
    //WORKING delete restaurant
    .delete('/:id', restaurants.delete)

  //TESTING loginreg

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
