const express = require('express');
const router = express.Router();
const restaurants = require('./../controllers/restaurants');
// const customers = require('./../controllers/customers');

router.get('/', restaurants.all)
    .get('/:id', restaurants.getOneById)
    //gets all customers from a restaurant
    .get('/:id/:cid',restaurants.getCustomers)
    .post('/', restaurants.create)
    .put('/:id', restaurants.update)
    //adds customer to restaurant
    .put('/:id/:cid',restaurants.addCustomer)
    // deletes customer from restaurant
    //.delete('/:id/:cid', restaurants.deleteCustomer)
    .delete('/:id', restaurants.delete)
    
    // .get('/', customers.all)
    // .get('/:id', customers.getOneById)
    // .post('/', customers.create)
    // .put('/:id', customers.update)
    // .delete('/:id', customers.delete)

module.exports = router;
