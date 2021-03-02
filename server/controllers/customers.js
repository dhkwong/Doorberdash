const mongoose = require('mongoose');
require('./passport-auth')
//passport for jwt auth
const passport = require('passport')
const Customer = mongoose.model('Customer')
const Restaurant = mongoose.model('Restaurant')
module.exports = {
    //WORKING
    findLoggedInCustomer: (req, res, next) => {
        //authenticates with token in req.header before proceeding
        // res.json({test:'test'})
        //currently reaches here, but doesnt authenticate
        passport.authenticate('jwt-customer', { session: false }, (err, customer, info) => {
            console.log("info" + info)
            // res.json({customerjsontest:customer})
            //doesnt get here, giving unhandled promise error

            //checking for errors
            if (err) {
                console.log(err)
            }
            //checking for authorization issues in jwt-customer strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                console.log(`found customer: ${customer}`)
                Customer.findById({ _id: customer._id })
                    .populate('customer')
                    .then(data => {
                        //if everything checks out, return customer with populated customer data
                        //convert document type to json, then remove password and send to client side for security
                        tempcustomer = data.toJSON()
                        delete tempcustomer.password
                        res.json({ customer: tempcustomer })
                        res.end()
                    })

            }
            //being implemented as a callback, so we need the (req,res,next) twice. aka closures
            //A Closure is an inner function that has access to the outer function's variables (scope-chain) and Closures are extensively used in Node.js and JavaScript. In this case, (err,restaurant,info) have acess to req,res,next. Due to this, we need to send (req,res,next) below
        })
            (req, res, next);
    },
    //WORKING
    all: async (req, res) => {
        try {
            const customers = await Customer.find();
            res.json({ customers: customers });
        }
        catch (err) {
            res.json(err);
        }
    },
    //WORKING
    //OUTDATED BY findLoggedInCustomer
    getOneById: (req, res) => {
        Customer.findById({ _id: req.params.id })
            .then((data) => {
                res.json({ customer: data })
            })
            .catch(err => res.json(err));
    },
    //WORKING
    //OUTDATED BY customerRegister
    create: (req, res) => {
        const customer = new Customer(req.body);
        customer.save()
            .then((data) => {
                res.json({ newCustomer: data });
            })
            .catch(err => res.json(err));
    },
    //WORKING WITH JWT AUTH
    update: (req, res, next) => {
        passport.authenticate('jwt-customer', { session: false }, (err, customer, info) => {
            if (err) {
                console.log(err)
            }
            //checking for authorization issues in jwt-customer strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                Customer.findOneAndUpdate({ _id: customer.id }, req.body, { new: true })
                    .then((data) => {
                        let tempcustomer = data.toJSON()
                        delete tempcustomer.password
                        res.json({ updatedCustomer: tempcustomer });
                    })
                    .catch(err => res.json(err));
            }

        })(req, res, next)
    },
       //authenticates by Customer since it is used only by customer
   //WORKING returns an array of dish objects 
   getMenuFromRestaurantById: (req,res,next)=>{
    passport.authenticate('jwt-customer',{session:false},(err, restaurant, info)=>{
        console.log("restaurant id for menu: "+JSON.stringify(req.params))
        if (err) {
            console.log("Get menu from Restaurant error " + err)
            res.json({ err: err })
        }
        if (info != undefined) {
            console.log(info.message)
            res.json({ error: info.message })
        }
        else {
        Restaurant.findOne({_id: req.params.id})
            .then(restaurant=>{
                
                let menu = restaurant.dish
                console.log("menu: "+JSON.stringify(menu))
                res.json({menu:menu})
                
            })
            .catch(err =>{
                console.log("Error in getMenuFromRestaurantById in restaurant.js: " + err)
                res.json({error:err})
            })
        }
    })(req,res,next)


},
    // update: (req, res) => {
    //     Customer.updateOne({ _id: req.params.id }, req.body)
    //         .then((data) => {
    //             res.json({ updatedCustomer: data });
    //         })
    //         .catch(err => res.json(err));
    // },

    //WORKING WITH PASSPORT AUTH
    //deletes logged in customer account and then returns the user that was just deleted
    deleteLoggedInCustomer: (req, res, next) => {
        passport.authenticate('jwt-customer', { session: false }, (err, customer, info) => {
            if (err) {
                console.log(err)
            }
            //checking for authorization issues in jwt-customer strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                Customer.findOneAndDelete({ _id: customer.id })
                    .then(deletedcustomer => {
                        let temp = deletedcustomer.toJSON()
                        delete temp.password
                        res.json({ deletedcustomer: temp })
                    })
            }
        })(req, res, next)
    },
    //WORKING AND KEEP FOR ADMINISTRATIVE USES
    delete: (req, res) => {
        Customer.findOneAndDelete({ _id: req.params.id })
            .then((data) => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    },
}
