const { json } = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require("mongodb"), ObjectId = mongodb.ObjectID
//passport for jwt auth
var passport = require('passport')
const bcrypt = require('bcrypt')
const Restaurant = mongoose.model('Restaurant')
const Customer = mongoose.model('Customer')
const Dish = mongoose.model('Dish')


//local passport strategy
passport.use(new Strategy(function (email, password, cb) {
    restaurants.findByEmail(email, function (err, user) {
        if (err) { return cb(err) }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false) }
    })
}))

module.exports = {
    //to organize, could possibly  make an orders.js and dishes.js. That way there's less code in restaurant.js and in restaurant.routes.js, it would look like .get('/:id/dish',dishes.getDishes)

    /*
    *
    *
    * 
    * 
    * 
    *Restaurant logic
    * 
    * 
    * 
    * 
    */
    //WORKING gets ALL restaurants
    //tentative login passport logic
    /**
     * var passport = require('passport')
      , LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
        });
    }
    ));
     * 
     */
    //findByEmail for passport local strategy
    findByEmail: (req,res)=>{
        Restaurant.findOne({email:req.body.email})
        .then(restaurant=>{
            res.json({restaurant:restaurant})
        })
    },
    login: (req, res) => {
        // from passport documentation
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.json('/users/' + req.user.username);
    },
    register: (req,res)=>{
        Restaurant.findOne({email:req.body.email})
        .then((user)=>{
        if(user){
            return res.status(400).json({email:"user already exists with this email"})
        }
        else{
            var newRestaurant = new Restaurant(req.body)
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(req.body.password,salt,(err,hash)=>{
                    newRestaurant.password = hash
                    newRestaurant.save();
                })
            })
            
            passport.authenticate('local')(req,res,function(){
                console.log(`created new user ${req.body.username}`)
                res.status(201).send()
            })
        
    }})
    //.catch(err=> if err, may need to gensalt here. should be fine though)
    },
    all: async (req, res) => {
        try {
            const restaurants = await Restaurant.find();
            res.json({ restaurants: restaurants });
        }
        catch (err) {
            res.json(err);
        }
    },
    //WORKING gets ONE restaurant
    getOneById: (req, res) => {
        Restaurant.findById({ _id: req.params.id })
            .populate('customer')
            .then((data) => {
                res.json({ restaurant: data })
            })
            .catch(err => res.json(err));
    },
    //WORKING creates restaurant
    create: (req, res) => {
        const restaurant = new Restaurant(req.body);
        restaurant.save()
            .then((data) => {
                res.json({ newRestaurant: data });
            })
            .catch(err => res.json(err));
    },
    //WORKING updates restaurant
    update: (req, res) => {
        Restaurant.updateOne({ _id: req.params.id }, req.body)
            .then((data) => {
                res.json({ updatedRestaurant: data });
            })
            .catch(err => res.json(err));
    },
    //WORKING deletes restaurant
    delete: (req, res) => {
        Restaurant.findOneAndDelete({ _id: req.params.id }, { new: true })
            .then((data) => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    },

    /*
    *
    *
    * 
    * 
    * 
    * Dish logic for restaurant 
    * 
    * 
    * 
    * 
    */
    //WORKING gets ALL dishes in a restaurant's menu
    getDishes: (req, res) => {
        Restaurant.findOne(req.params.did)
            .then(restaurant => {
                res.json({ dishes: restaurant.dish })
            })
            .catch(err => res.json("Error in getDishes in restaurant.js: " + err))
    },
    //WORKING gets ONE dish from the restaurant menu
    // .get('/:id/:did/dish',restaurants.getDish)
    getDish: (req, res) => {
        //Restaurant.findOne({ _id: req.params.id }, { _id: 0, customer: { $elemMatch: { _id: req.params.cid } } })
        Restaurant.findOne({ _id: req.params.id }, { dish: { $elemMatch: { _id: req.params.did } } })
            .then(dish => {
                res.json({ dish: dish.dish[0] })
            })
    },
    //WORKING BUT finalize query to check for $ne
    //add dish to menu
    //.put('/:id/dish', restaurants.addDish)
    addDish: (req, res) => {
        newdish = new Dish(req.body)
        //$ne checks to see if the dish name is NOT EQUAL to any other dish in the array...may be redundant with $addtoSet
        Restaurant.updateOne({ _id: req.params.id, 'dish.name': { $ne: req.body.name } },
            { $addToSet: { dish: newdish } })
            .then((updatedRestaurant) => {
                //validator for dish update. Model.n is how many values were changed. It will always be 1 since we only add dishes one at a time
                if (updatedRestaurant.n === 1) {
                    res.json({ updatedRestaurant: true })
                }
                else {
                    res.json({ error: "dish already exists" })
                }
            })
            .catch(err => {
                res.json("addDish error in restaurants.js: " + err)
            })
    },
    //WORKING delete dish from menu
    //.put('/:id/:did/dish',restaurants.deleteDish)
    deleteDish: (req, res) => {
        //finds by id, then pulls from the "dish" key value, specifically query by _id given. also why $pull:dish.id didn't work. there was not dish.id field in restaurant
        //{new:true} explicitly states to return the new updated model instead of the old one before the update goes through
        Restaurant.findByIdAndUpdate(req.params.id, { $pull: { "dish": { _id: req.params.did } } }, { new: true })
            .then((updatedRestaurant) => {
                console.log("Updated restaurant: " + updatedRestaurant)

                res.json({ updatedDishes: updatedRestaurant.dish })
            })
            .catch(err => {
                res.json("addDish error in restaurants.js: " + err)
            })
    },

    /*
    *
    *
    * 
    * 
    * 
    * Customer logic for restaurants
    * 
    * 
    * 
    * 
    */
    //WORKING gets ALL customers from a restaurant
    //.get('/:id/customers', restaurants.getCustomers)
    getCustomers: (req, res) => {
        //populates all of the customers from the customer table by referencing the userId's listed in the restaurant customer field
        Restaurant.findOne({ _id: req.params.id }).populate('customer')
            .exec(function (err, customers) {
                if (err) {
                    return handleError(err)
                }
                else {
                    //return all customers as objects in allCustomers array. e.g allCustomers[{customer object},{customer object}]
                    res.json({ allCustomers: customers.customer })
                }
            })

    },
    //WORKING FOR NEW MODEL. Retrieves ONE customer and ALL their orders
    //.get('/:id/:cid', restaurants.getCustomer)
    getCustomer: (req, res) => {

        Restaurant.findOne({ '_id': req.params.id }, { _id: 0, customer: { $elemMatch: { _id: req.params.cid } } })
            .then((customer) => {
                //return customer
                console.log("testing: " + customer)
                //returns as just the object vs the array in the object. {customer} vs [{customer}], customer.customer[0]
                res.json({ customer: customer })

            })
            .catch(err => {
                res.json("getCustomer error in restaurants.js: " + err)
            })

    },
    //WORKING FOR NEW MODEL, TESTING UNIQUE adds customer ID to restaurant ref. returns all customers
    //.put('/:id/:cid', restaurants.addCustomer)
    addCustomer: (req, res) => {
        Customer.findById({ _id: req.params.cid })
            .then((customer) => {
                let newcustomer = new Customer(customer)
                Restaurant.findOne({ _id: req.params.id })
                    .then(restaurant => {

                        //returns a restaurant, which we push the new customer to the array of customers in the restaurant 'customer' field
                        let value = req.params.cid
                        //does not check for unique yet, BUT pushes id and an order
                        restaurant.customer.push({ '_id': mongodb.ObjectID(req.params.cid), 'order': [] });
                        // res.json(restaurant.customer)
                        restaurant.save((data) => {
                            res.json({ newCustomer: restaurant })

                        })
                            .catch(
                                err => res.json("error in addCustomer for restuarants.js: " + err)
                            );
                    })
            })

    },
    //WORKING WITH NEW MODEL to see if findbyidandupdate works for deleting a customer
    //.delete('/:id/:cid', restaurants.deleteCustomer)
    deleteCustomer: (req, res) => {
        Restaurant.findOneAndUpdate({ _id: req.params.id }, { new: true })
            .then((restaurant) => {
                var index = restaurant.customer.indexOf(req.params.cid)
                console.log(restaurant.customer)
                console.log(index)
                //should work to delete all dishes of the customer's as well, since you're deleting the entire object at the index
                restaurant.customer.splice(index, 1);
                restaurant.save();
                //returns restaurant
                return res.status(200).json({ updatedRestaurant: restaurant })
            })
            .catch(err => {
                res.json("error in deleteCustomer in restaurants.js: " + err)
            });
    },


    /*
    *
    *
    * 
    * 
    * 
    * Orders logic for restaurant customers
    * 
    * 
    * 
    * 
    */
    /*
    *
    *
    * 
    * 
    * 
    * 
    * 
    * 
    * WORKING HERE
    * 
    * 
    * 
    * 
    */
    //WORKING once addOrder works get ALL of ONE customer's orders
    //.get('/:id/:cid/order', restaurants.getCustomerOrders)
    getCustomerOrders: (req, res) => {
        /*
            db.extractSubArrayDemo.find({ '_id': 101 },{ _id: 0, ClientDetails:
            { $elemMatch: {ClientProjectName: 'Pig Dice Game' } }}).pretty();
            _id:0 only returns the customer and order array. without it, it also returns the restaurantID
            From Mongodb docs:
            _id Field Projection
            The _id field is included in the returned documents by default unless you explicitly specify _id: 0 in the projection to suppress the field.
        */
        Restaurant.findOne({ _id: req.params.id }, { _id: 0, customer: { $elemMatch: { _id: req.params.cid } } })
            .then(order => {

                res.json({
                    order: order.customer[0]
                    // .customer[0].order 
                })
            })
            .catch(err => {
                res.json("error in getCustomerOrders: " + err)
            })

    },


    //WORKING Adds ONE order to a customer
    //.put('/:id/:cid/order', restaurants.addOrder)
    addOrder: (req, res) => {
        //assume we push the dish object as POST
        let dish = new Dish(req.body)

        Restaurant.findOne({ '_id': req.params.id }, { customer: { $elemMatch: { _id: req.params.cid } } })
            .then(data => {
                //no need to test for uniqueness since someone can get multiple dishes

                data.customer[0].order.push(dish)
                data.save()
                // returns -> {order[dishschema],_id:'customerid'}
                res.json({ "added order data": data.customer })
            })
            .catch(err => {
                res.json("Error in addOrder restaurant.js: " + err)
            })
    },
    /*
*
*
* 
* 
* 
* 
* 
* Working here
* 
* 
* 
* 
* 
* 
* 
* 
* 
*/
    //WORKING WITH NEW MODEL deletes order from customer
    //.delete('/:id/:cid/:did/order/', restaurants.deleteOrder)
    deleteOrder: (req, res) => {
        let dish = new Dish()

        Restaurant.findOne({ _id: req.params.id }, { customer: { $elemMatch: { _id: req.params.cid } } })
            .then((data) => {

                // index = data.customer[0].order.indexOf(req.params.did)

                for (let i = 0; i < data.customer[0].order.length; i++) {
                    console.log("test" + data.customer[0].order[i]._id)
                    if (data.customer[0].order[i]._id == req.params.did) {
                        data.customer[0].order.splice(i, 1)
                        data.save()
                        console.log("deleted order data: " + i)
                        res.json({ customer: data })

                    }
                }
                res.json(false)

                let index = findIndex

            })
            .catch(err => {
                res.json("Error in deleteOrder at restaurant.js: " + err)
            })
    },

    /* Customer logic */


}
