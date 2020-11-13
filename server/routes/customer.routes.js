const express = require('express');
const router = express.Router();
const customers = require('./../controllers/customers');
const loginreg = require('../controllers/loginreg')

router
    // .get('/jwtrefresh',loginreg.customerRefresh)
    //customer loginreg  
    .post('/customerregister',loginreg.customerRegister)
    .post('/customerlogin',loginreg.customerLogin)
    .get('/findcustomer',customers.findLoggedInCustomer)

    .get('/', customers.all)
    .get('/:id', customers.getOneById)
    //now customerregister
    .post('/', customers.create)
    //need to add jwt verification 
    .put('/:id', customers.update)
    //maybe add jwt verification
    .delete('/:id', customers.delete)

module.exports = router;
