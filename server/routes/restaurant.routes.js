const express = require('express');
const router = express.Router();
const restaurants = require('./../controllers/restaurants');
// require passport for jwt authentication
const passport = require('passport')
// const customers = require('./../controllers/customers');

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
router
    //TESTING login
    // 'local' field indicates that we're using the 'local' strategy of authentication vs say, heroku or facebook
    .post('/login',passport.authenticate('local'),restaurants.login)
    //currently organized by organize by restaurant, customer, and customer order  THEN by request type. GET, POST, PUT, DELETE.

    //theoretical passport get request using validation. setting session to false to be able to verify per request for security
    .get('/api/users/me',
        passport.authenticate('basic', { session: false }),
        function(req, res) {
            // If user is logged in, passport.js will create user object in req for every request in express.js, which you can check for existence in any middleware:
            console.log("user data: "+req.user)
            res.json({ id: req.user.id, username: req.user.username })
        })
    //or
    //not /:id since req.user._id will be the restaurant id
    app.get('/restaurant', loggedIn, restaurants.getOneById)
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
    //adds one order to customer
    .put('/:id/:cid/order', restaurants.addOrder)
    //deletes one order from customer
    .delete('/:id/:cid/:did/order/', restaurants.deleteOrder)

module.exports = router;
