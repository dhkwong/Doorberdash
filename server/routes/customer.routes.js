const express = require('express');
const router = express.Router();
const customers = require('./../controllers/customers');
const loginreg = require('../controllers/loginreg')

router
    //customer loginreg  
    .post('/customerregister',loginreg.customerRegister)
    .post('/customerlogin',loginreg.customerLogin)
    .get('/findcustomer',customers.findLoggedInCustomer)

    .get('/', customers.all)
    .get('/:id', customers.getOneById)
    .post('/', customers.create)
    .put('/:id', customers.update)
    .delete('/:id', customers.delete)

module.exports = router;
