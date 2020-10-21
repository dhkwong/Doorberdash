const express = require('express');
const router = express.Router();
const Restaurant = mongo
const restaurants = require('./../controllers/restaurants');
// require passport for jwt authentication
const passport = require('passport')
const ensurelogin = require('connect-ensure-login').ensureLoggedIn
// const customers = require('./../controllers/customers');

// function loggedIn(req, res, next) {
//     if (req.user) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// }
//function for passport 'local' strategy
passport.use(new Strategy(function (email, password, cb) {
    restaurants.findByEmail(email, function (err, user) {
        if (err) { return cb(err) }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false) }
    })
}))
router

    //TESTING login
    // 'local' field indicates that we're using the 'local' strategy of authentication vs say, heroku or facebook
    .post('/login', passport.authenticate('local', { session: false }), restaurants.login)
    .post('/register', restaurants.register)


    //theoretical passport get request using validation. setting session to false to be able to verify per request for security
    // .get('/api/users/me',
    //     passport.authenticate('basic', { session: false }),
    //     function (req, res) {
    //         // If user is logged in, passport.js will create user object in req for every request in express.js, which you can check for                 existence in any middleware:
    //         console.log("user data: " + req.user)
    //         res.json({ id: req.user.id, username: req.user.username })
    //     })
    //or
    //not /:id since req.user._id will be the restaurant id. check if this one is with session though. may just be in general
    //only pivot if ensurelogin doesn't work
    //.get('/restaurant', loggedIn, restaurants.getOneById)


    //currently organized by organize by restaurant, customer, and customer order  THEN by request type. GET, POST, PUT, DELETE.
    //WORKING get all restaurants
    .get('/', restaurants.all)
    //WORKING get one restaurant, uses passport require('connect-ensure-login').ensureLoggedIn to verify login
    .get('/:id', ensurelogin, restaurants.getOneById)
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
