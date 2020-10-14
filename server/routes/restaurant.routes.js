const express = require('express');
const router = express.Router();
const restaurants = require('./../controllers/restaurants');
// const customers = require('./../controllers/customers');

router
    //currently organized by organize by restaurant, customer, and customer order  THEN by request type. GET, POST, PUT, DELETE.
    //WORKING get all restaurants
    .get('/', restaurants.all)
    //WORKING get one restaurant
    .get('/:id', restaurants.getOneById)
    //WORKING gets all dishes
    .get('/:id/dish',restaurants.getDishes)
    //TEST get one dish from restaurant
    .get('/:id/:did/dish',restaurants.getDish)
    //WORKING create a restaurant
    .post('/', restaurants.create)
    //WORKING update restaurant
    .put('/:id', restaurants.update)
    //WORKING add dish to restaurant menu
    .put('/:id/dish', restaurants.addDish)
    //WORKING delete dish from restaurant menu
    .delete('/:id/:did/dish',restaurants.deleteDish)
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
    //adds one order to customer final route .put('/:id/:did/:cid/order', restaurants.addOrder) unless you dont need to since front end pulls the dish from the id in the first place
    .put('/:id/:cid/order', restaurants.addOrder)
    //deletes one order from customer
    .delete('/:id/:cid/:did/order/', restaurants.deleteOrder)

module.exports = router;
