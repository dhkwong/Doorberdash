const express = require('express');
const router = express.Router();
const restaurants = require('./../controllers/restaurants');
// const customers = require('./../controllers/customers');
        
router
//currently organized by request type. GET, POST, PUT, DELETE. Consider changing to organize by order, customer, restaurant
    //get all restaurants
    .get('/', restaurants.all)
    //get one restaurant
    .get('/:id', restaurants.getOneById)
    //gets all customers from a restaurant
    .get('/:id/customers',restaurants.getCustomers)
    //gets ONE customer from a restaurant
    .get('/:id/:cid', restaurants.getCustomer)
    //get all orders from customer
    .get('/:id/:cid/order',restaurants.getCustomerOrders)
    //add order to customer
    .put('/:id/:cid/order/',restaurants.addOrder)
    //create a restaurant
    .post('/', restaurants.create)
    //update restaurant
    .put('/:id', restaurants.update)
    //add dish to restaurant menu
    .put('/:id/dish',restaurants.addDish)
    //adds customer to restaurant
    .put('/:id/:cid',restaurants.addCustomer)
    //adds one order to customer
    .put('/:id/:cid/order/',restaurants.addOrder)
     //deletes one order from customer
    .delete('/:id/:cid/order/',restaurants.deleteOrder)
    // deletes one customer from restaurant
    .delete('/:id/:cid', restaurants.deleteCustomer)
    //delete restaurant
    .delete('/:id', restaurants.delete)

module.exports = router;
