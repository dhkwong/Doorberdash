const express = require('express');
const router = express.Router();
const restaurants = require('./../controllers/restaurants');
// const customers = require('./../controllers/customers');

router
    //currently organized by organize by restaurant, customer, and customer order  THEN by request type. GET, POST, PUT, DELETE. Consider changing to 
    //get all restaurants
    .get('/', restaurants.all)
    //get one restaurant
    .get('/:id', restaurants.getOneById)
    //create a restaurant
    .post('/', restaurants.create)
    //update restaurant
    .put('/:id', restaurants.update)
    //add dish to restaurant menu
    .put('/:id/dish', restaurants.addDish)
    //delete restaurant
    .delete('/:id', restaurants.delete)


    /* restaurant customer logic */
    //gets all customers from a restaurant
    .get('/:id/customers', restaurants.getCustomers)
    //gets ONE customer from a restaurant
    .get('/:id/:cid', restaurants.getCustomer)
    //adds customer to restaurant
    .put('/:id/:cid', restaurants.addCustomer)
    // deletes one customer from restaurant
    .delete('/:id/:cid', restaurants.deleteCustomer)

    /* customer orders routes */
    //get all orders from customer
    .get('/:id/:cid/order', restaurants.getCustomerOrders)
    //adds one order to customer
    .put('/:id/:cid/order/', restaurants.addOrder)
    //add order to customer
    .put('/:id/:cid/order/', restaurants.addOrder)
    //deletes one order from customer
    .delete('/:id/:cid/order/', restaurants.deleteOrder)

module.exports = router;
