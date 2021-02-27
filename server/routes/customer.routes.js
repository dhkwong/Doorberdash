const express = require('express');
const router = express.Router();
const customers = require('./../controllers/customers');

const loginreg = require('../controllers/loginreg')

router
    // .get('/jwtrefresh',loginreg.customerRefresh)
    //customer loginreg  
    .post('/customerregister', loginreg.customerRegister)
    .post('/customerlogin', loginreg.customerLogin)
    .get('/findcustomer', customers.findLoggedInCustomer)

    .get('/', customers.all)
    .get('/:id', customers.getOneById)
    //get menu for customer
    .get('/:id/menu', customers.getMenuFromRestaurantById)
    //now customerregister
    .post('/', customers.create)
    //need to add jwt verification 
    // .put('/:id', customers.update)
    .put('/', customers.update)
    //deletes logged in customer
    .delete('/', customers.deleteLoggedInCustomer)
    //deletes customer by ID, saved for administrative usage
    .delete('/:id', customers.delete)

module.exports = router;
