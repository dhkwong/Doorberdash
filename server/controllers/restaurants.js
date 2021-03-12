const { json } = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require("mongodb"), ObjectId = mongodb.ObjectID
require('./passport-auth')
//passport for jwt auth
const passport = require('passport')
// var LocalStrategy = require('passport-local')
// const bcrypt = require('bcrypt')
const Restaurant = mongoose.model('Restaurant')
const Customer = mongoose.model('Customer')
const Dish = mongoose.model('Dish')



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

    //login and reg moved to ../controllers/loginreg.js
    all: async (req, res) => {
        try {
            const restaurants = await Restaurant.find();
            let temprestaurant = restaurants
            //remove password to sanitize data
            temprestaurant.forEach(function (item) {
                console.log("pass: " + item.password)
                //password cannot be configured so we change it to undefined
                item.password = undefined
                return item
            })
            console.log("temprestaurant: " + temprestaurant)
            res.json({ restaurants: temprestaurant });
        }
        catch (err) {
            res.json(err);
        }
    },
    //WORKING Restaurant getOneById with jwt authorization
    findLoggedInRestaurant: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log(err)
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                console.log(`found restaurant: ${restaurant}`)
                Restaurant.findById({ _id: restaurant._id })
                    .populate('customer')
                    .then(data => {
                        //if everything checks out, return restaurant with populated customer data
                        //convert document type to json, then remove password and send to client side for security
                        temprestaurant = data.toJSON()
                        delete temprestaurant.password
                        res.json({ restaurant: temprestaurant })
                        res.end()
                    })

            }
            //being implemented as a callback, so we need the (req,res,next) twice. aka closures
            //A Closure is an inner function that has access to the outer function's variables (scope-chain) and Closures are extensively used in Node.js and JavaScript. In this case, (err,restaurant,info) have acess to req,res,next. Due to this, we need to send (req,res,next) below
        })
            (req, res, next);
    },
    //WORKING gets ONE restaurant
    getOneById: (req, res) => {

        Restaurant.findById({ _id: req.params.id })
            .populate('customer')
            .then((data) => {
                let temprestaurant = data
                delete temprestaurant.password
                console.log("getting one restaurant in restaurants.js: " + temprestaurant)
                //return restaurant data without password
                res.json({ restaurant: temprestaurant })
            })
            .catch(err => res.json(err));
    },
    //WORKING creates restaurant
    //outdated by loginreg.restaurantRegister
    // create: (req, res) => {
    //     const restaurant = new Restaurant(req.body);
    //     restaurant.save()
    //         .then((data) => {
    //             res.json({ newRestaurant: data });
    //         })
    //         .catch(err => res.json(err));
    // },

    //WORKING updates restaurant
    update: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {

            //checking for errors
            if (err) {
                console.log(err)
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                Restaurant.findOneAndUpdate({ _id: restaurant.id }, req.body, { new: true }).then((restaurant) => {
                    //remove password to protect data
                    let temprestaurant = restaurant.toJSON()
                    delete temprestaurant.password
                    res.json({ updatedrestaurant: temprestaurant })

                })
            }

        })(req, res, next)

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
    getDishesFromLoggedInRestaurant: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            if (err) {
                console.log("Get Dishes from Restaurant error " + err)
                res.json({ err: err })
            }
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
            }
            else {

                Restaurant.findOne({ _id: restaurant.id })
                    .then(restaurant => {
                        res.json({ dishes: restaurant.dish })
                    })
                    .catch(err => res.json("Error in getDishes in restaurant.js: " + err))

            }
        })(req, res, next)
    },

    //WORKING gets ONE dish from the restaurant menu
    getDishFromLoggedInRestaurant: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })

            } else {

                Restaurant.findOne({ _id: restaurant.id }, { dish: { $elemMatch: { _id: req.params.did } } })
                    .then(dish => {
                        //dish is a Document, so we have to convert to object for manipulation
                        let newdish = dish.toObject()
                        //delete restaurant ID
                        delete newdish._id

                        console.log("retrieved dish: " + JSON.stringify(newdish))
                        res.json({ dish: newdish.dish[0] })
                    })
            }
        })(req, res, next)
        //Restaurant.findOne({ _id: req.params.id }, { _id: 0, customer: { $elemMatch: { _id: req.params.cid } } })
    },

    //WORKING
    addDishToLoggedInRestaurant: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                console.log("dish created and added: " + JSON.stringify(req.body))

                //$ne checks to see if the dish name is NOT EQUAL to any other dish in the array...may be redundant with $addtoSet
                Restaurant.updateOne({ _id: restaurant._id, 'dish.name': { $ne: req.body.name } },
                    { $addToSet: { dish: req.body } })
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
            }
        })(req, res, next);
    },
    //WORKING error handling not fully fleshed out and tested yet
    updateDishInLoggedInRestaurant: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                console.log("editing dish: " + JSON.stringify(req.body))
                Restaurant.updateOne({ _id: restaurant._id, 'dish': { $elemMatch: { '_id': req.body.id } } }, {
                    $set: {
                        "dish.$.name": req.body.name,
                        "dish.$.description": req.body.description,
                        "dish.$.time": req.body.time
                    }
                })
                    .then((updatedDish) => {
                        console.log("updating dish results: " + JSON.stringify(updatedDish))
                        if (updatedDish.n === 1) {
                            res.json(true)
                        } else {
                            res.json({ error: "update failed" })
                        }
                    })
                    .catch(err => {
                        console.log("updateDishInLoggedInRestaurant: " + err)
                        res.json({ error: err })
                    }

                    )
            }
        })(req, res, next)
    },

    //WORKING delete dish from a restaurant menu
    //.put('/:did/dish',restaurants.deleteDish)
    deleteDish: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                //finds by id, then pulls from the "dish" key value, specifically query by _id given. also why $pull:dish.id didn't work. there was not dish.id field in restaurant
                //{new:true} explicitly states to return the new updated model instead of the old one before the update goes through
                Restaurant.findByIdAndUpdate(restaurant.id, { $pull: { "dish": { _id: req.params.did } } }, { new: true })
                    .then((updatedRestaurant) => {
                        console.log("Updated restaurant: " + updatedRestaurant)

                        res.json({ updatedDishes: updatedRestaurant.dish })
                    })
                    .catch(err => {
                        res.json("addDish error in restaurants.js: " + err)
                    })
            }
        })(req, res, next)
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
    //WORKING TENTATIVELY WITH PASSPORT. TEST WITH ACTUAL DISHES  gets ALL customers from a restaurant
    getCustomers: (req, res, next) => {
        //populates all of the customers from the customer table by referencing the userId's listed in the restaurant customer field
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                Restaurant.findOne({ _id: restaurant.id }).populate('customer')
                    .exec(function (err, customers) {
                        if (err) {
                            return handleError(err)
                        }
                        else {
                            //return all customers as objects in allCustomers array. e.g allCustomers[{customer object},{customer object}]
                            res.json({ allCustomers: customers.customer })
                        }
                    })
            }

        })(req, res, next)

    },
    //.get('/:id/customers', restaurants.getCustomers)
    // getCustomers: (req, res) => {
    //     //populates all of the customers from the customer table by referencing the userId's listed in the restaurant customer field
    //     Restaurant.findOne({ _id: req.params.id }).populate('customer')
    //         .exec(function (err, customers) {
    //             if (err) {
    //                 return handleError(err)
    //             }
    //             else {
    //                 //return all customers as objects in allCustomers array. e.g allCustomers[{customer object},{customer object}]
    //                 res.json({ allCustomers: customers.customer })
    //             }
    //         })

    // },

    //WORKING WITH PASSPORT AUTH
    getCustomer: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                Restaurant.findOne({ '_id': restaurant.id }, { _id: 0, customer: { $elemMatch: { _id: req.params.cid } } })
                    .then((customer) => {
                        //return customer
                        //returns as just the object vs the array in the object. {customer} vs [{customer}], customer.customer[0]
                        res.json({ customer: customer.customer })

                    })
                    .catch(err => {
                        res.json("getCustomer error in restaurants.js: " + err)
                    })
            }
        })(req, res, next)

    },
    //WORKING FOR NEW MODEL. Retrieves ONE customer and ALL their orders
    //.get('/:id/:cid', restaurants.getCustomer)
    // getCustomer: (req, res) => {

    //     Restaurant.findOne({ '_id': req.params.id }, { _id: 0, customer: { $elemMatch: { _id: req.params.cid } } })
    //         .then((customer) => {
    //             //return customer
    //             console.log("testing: " + customer)
    //             //returns as just the object vs the array in the object. {customer} vs [{customer}], customer.customer[0]
    //             res.json({ customer: customer })

    //         })
    //         .catch(err => {
    //             res.json("getCustomer error in restaurants.js: " + err)
    //         })

    // },
    //WORKING WITH PASSPORT AUTH + UNIQUENESS
    addCustomer: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {

                res.json({ error: info.message })
                // res.end()
            } else {
                Customer.findById({ _id: req.params.cid })
                    .then((customer) => {
                        let newcustomer = new Customer(customer)
                        Restaurant.findOne({ _id: restaurant.id })
                            .then(dbrestaurant => {
                                let temp = dbrestaurant.toJSON()
                                var index = temp.customer.findIndex(function (customer) {
                                    return customer._id == req.params.cid
                                })

                                if (index !== -1) {
                                    return res.json({ error: "Customer already exists" })
                                }
                                else {
                                    //returns a dbrestaurant, which we push the new customer to the array of customers in the dbrestaurant 'customer' field
                                    dbrestaurant.customer.push({ '_id': mongodb.ObjectID(req.params.cid), 'order': [] });
                                    dbrestaurant.save((data) => {
                                        //returns list of all customers
                                        res.json({ newCustomer: dbrestaurant.customer })

                                    })
                                        .catch(
                                            err => res.json("error in addCustomer for restuarants.js: " + err)
                                        );
                                }
                            })
                    })
            }
        })(req, res, next)

    },
    //pre-auth
    //WORKING FOR NEW MODEL, TESTING UNIQUE adds customer ID to restaurant ref. returns all customers
    //.put('/:id/:cid', restaurants.addCustomer)
    // addCustomer: (req, res) => {
    //     Customer.findById({ _id: req.params.cid })
    //         .then((customer) => {
    //             let newcustomer = new Customer(customer)
    //             Restaurant.findOne({ _id: req.params.id })
    //                 .then(restaurant => {

    //                     //returns a restaurant, which we push the new customer to the array of customers in the restaurant 'customer' field
    //                     let value = req.params.cid
    //                     //does not check for unique yet, BUT pushes id and an order
    //                     restaurant.customer.push({ '_id': mongodb.ObjectID(req.params.cid), 'order': [] });
    //                     // res.json(restaurant.customer)
    //                     restaurant.save((data) => {
    //                         res.json({ newCustomer: restaurant })

    //                     })
    //                         .catch(
    //                             err => res.json("error in addCustomer for restuarants.js: " + err)
    //                         );
    //                 })
    //         })

    // },
    //WORKING FOR PASSPORT AUTH/CHECK OTHERWISE AFTER JWTADDORDER
    deleteCustomer: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })
                // res.end()
            } else {
                Restaurant.findOneAndUpdate({ _id: restaurant.id }, { new: true })
                    .then((dbrestaurant) => {
                        let temp = dbrestaurant.toJSON()
                        var index = temp.customer.findIndex(function (customer) {
                            return customer._id == req.params.cid
                        })
                        // res.json({test:temp})
                        if (index == -1) {
                            res.json({ error: "Customer does not exist" })
                        }
                        else {
                            //should work to delete all dishes of the customer's as well, since you're deleting the entire object at the index
                            dbrestaurant.customer.splice(index, 1);
                            dbrestaurant.save();
                            //returns dbrestaurant
                            return res.json({ updatedRestaurantCustomers: dbrestaurant.customer })

                        }
                    })
                    .catch(err => {
                        res.json("error in deleteCustomer in restaurants.js: " + err)
                    })

            }
        })(req, res, next)
    },
    //WORKING WITH NEW MODEL to see if findbyidandupdate works for deleting a customer
    //.delete('/:id/:cid', restaurants.deleteCustomer)
    // deleteCustomer: (req, res) => {
    //     Restaurant.findOneAndUpdate({ _id: req.params.id }, { new: true })
    //         .then((restaurant) => {
    //             var index = restaurant.customer.indexOf(req.params.cid)
    //             console.log(restaurant.customer)
    //             console.log(index)
    //             //should work to delete all dishes of the customer's as well, since you're deleting the entire object at the index
    //             restaurant.customer.splice(index, 1);
    //             restaurant.save();
    //             //returns restaurant
    //             return res.status(200).json({ updatedRestaurant: restaurant })
    //         })
    //         .catch(err => {
    //             res.json("error in deleteCustomer in restaurants.js: " + err)
    //         });
    // },


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


    //WORKING once addOrder works get ALL of ONE customer's orders
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

    //WORKINFOR JWT AND PULLS DIRECTLY FROM EXISTING DISHES IN MENU
    jwtAddOrder: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                console.log({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })

            } else {
                //pull dish from restaurant in jwt header ID
                Restaurant.findOne({ _id: restaurant.id }, { dish: { $elemMatch: { _id: req.params.did } } })
                    .then(dish => {

                        //insert dish into 
                        Restaurant.findOne({ '_id': restaurant.id }, { customer: { $elemMatch: { _id: req.params.cid } } })
                            .then(data => {

                                const tempdish = new Dish(dish.toJSON().dish[0])
                                // res.json({tempdish:tempdish})
                                //if customer exists in restaurant(aka has a pre-existing order), push another dish to the customer's order
                                if (data.customer[0] !== undefined) {
                                    //no need to test for uniqueness since someone can get multiple dishes
                                    data.customer[0].order.push(tempdish)
                                    // res.json({test:data})
                                    data.save()
                                    // returns -> {order[dishschema],_id:'customerid'}
                                    res.json({ "added order data": data.customer })
                                }

                                //otherwise check the customer exists through the customer table 
                                //shouldnt have to hit here since the logic path doesnt allow for the customer to add without a pre-existing ID pulled directly from the customer table, but since we're passing customerID's through req.params, I need to make this for redundancy and safety
                                else {
                                    Customer.findOne({ '_id': req.params.cid })
                                        .then((customer) => {
                                            // res.json({customer:customer == null})
                                            //if customer id from req.params.cid doesnt exist, return error
                                            if (customer == null) {
                                                res.status(409).json({
                                                    status: false,
                                                    error: "customer does not exist",
                                                    user: null
                                                })
                                            }
                                            //this part is necessary for first customers unlike the previous if portion
                                            //else add customer and add an order
                                            else {
                                                Customer.findById({ _id: req.params.cid })
                                                    .then((customer) => {
                                                        let newcustomer = new Customer(customer)
                                                        Restaurant.findOne({ _id: restaurant.id })
                                                            .then(dbrestaurant => {
                                                                let temp = dbrestaurant.toJSON()
                                                                var index = temp.customer.findIndex(function (customer) {
                                                                    return customer._id == req.params.cid
                                                                })
                                                                // res.json({cutomer:temp.customer,dbrestaurant:dbrestaurant,dish:dish})
                                                                if (index !== -1) {
                                                                    return res.json({ error: "Customer already exists" })
                                                                }
                                                                else {
                                                                    //returns a dbrestaurant, which we push the new customer to the array of customers in the dbrestaurant 'customer' field
                                                                    //pushes tempdish into order array
                                                                    dbrestaurant.customer.push({ '_id': mongodb.ObjectID(req.params.cid), 'order': [tempdish] });
                                                                    dbrestaurant.save((data) => {
                                                                        //returns list of all customers
                                                                        res.json({ newCustomer: dbrestaurant.customer })

                                                                    })
                                                                        .catch(
                                                                            err => res.json("error in addCustomer for restuarants.js: " + err)
                                                                        );
                                                                }
                                                            })
                                                    })

                                            }

                                        })

                                    //push dish to customer order
                                }
                            })
                            .catch(err => {
                                res.json("Error in jwtaddOrder restaurant.js: " + err)
                                //need contingency plan for if there isn't a customer pre-existing. aka just instantiate an empty array
                            })
                    })
            }
        })(req, res, next)
    },
    /*
*
*
* 
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
*
*
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

    //TESTING adds all orders in an array of orders to restaurant under a customer
    //req.body contains orders array and restaurant id as .orders and .id respectively
    addOrders: (req, res, next) => {
        passport.authenticate('jwt-customer', { session: false }, (err, customer, info) => {
            console.log(req.body)
            if (err) {
                res.json({ error: err })
            }
            if (info != undefined) {
                console.log("info error at restaurants.js addOrders: " + JSON.stringify(info))
            } else {
                Restaurant.findOne({ '_id': req.body.id })
                    .then(restaurant => {

                        console.log("restaurant menu: " + JSON.stringify(restaurant))
                        //object with list of key:value pairs
                        let fullorder = req.body.orders
                        //array of dish documents to push
                        let orderarray = []


                        let temprestaurant = restaurant.toJSON()
                        //FIND IF CUSTOMER EXISTS.
                        //object is truthy, undefined/null would be falsy
                        if (temprestaurant.customer.find((restaurantcustomer) => { restaurantcustomer.id === customer.id })) {
                            //if true
                            console.log("customer exists")
                            insertOrder()
                        }else{
                            //insert customer into restaurant
                            Restaurant.findOne({ _id: restaurant.id })
                            .then((restaurant)=>{
                                //push customer id into restaurant array of customers
                                restaurant.customer.push(mongodb.ObjectID(customer.id))
                                insertOrder()
                            })
                        }

                        let insertOrder = (function () {
                            //check each dish in the order and populate orderarray
                            for (let dishname in fullorder) {
                                //find restaurant dish that matches the dish in the order
                                
                                    let restaurantdish = restaurant.findOne({ 'dish.name': dishname })
                               
                                    let len = order[key]
                                    if (restaurantdish) {
                                        for (let i = 0; i < len; i++) {
                                            orderarray.push(restaurantdish)
                                        }
                                    }
                                
                            }
                            //push all in order array to restaurant at customer

                            let temp = restaurant.toJSON()
                            let temprestaurant = Restaurant.findOne({ '_id': req.body.id }, { customer: { $elemMatch: { _id: customer.id } } })
                            .then(customer=>{
                                for(let order in fullorder){
                                    customer.order.push(order)
                                }
                                customer.save()
                                res.json({customer:customer})
                            })
                            // //get index of customer by jwt customer id
                            // var index = temp.customer.findIndex(function (findcustomer) {
                            //     return findcustomer._id == customer.id
                            // })

                            // if (index == -1) {
                            //     res.json({ error: "Customer does not exist" })
                            // }
                            // else {
                            //     //loop through each dish
                            //     for (let dish in orderarray) {
                            //         //add each dish to the customer's order
                            //         restaurant.customer[index].push(dish)
                            //     }
                            //     //save changes
                            //     restaurant.save();
                            //     //returns dbrestaurant
                            //     return res.json({ updatedRestaurantCustomers: restaurant.customer })
                            // }
                        }())
                    })

            }
        })(req, res, next)
    },
    //WORKING Adds ONE order to a customer
    // addOrder: (req, res) => {

    //     //assume we push the dish object as POST
    //     let dish = new Dish(req.body)

    //     Restaurant.findOne({ '_id': req.params.id }, { customer: { $elemMatch: { _id: req.params.cid } } })
    //         .then(data => {
    //             //no need to test for uniqueness since someone can get multiple dishes

    //             data.customer[0].order.push(dish)
    //             data.save()
    //             // returns -> {order[dishschema],_id:'customerid'}
    //             res.json({ "added order data": data.customer })
    //         })
    //         .catch(err => {
    //             res.json("Error in addOrder restaurant.js: " + err)
    //         })
    // },


    //WORKING WITH NEW MODEL deletes order from customer
    //.delete('/:id/:cid/:did/order/', restaurants.deleteOrder)
    deleteOrder: (req, res, next) => {
        passport.authenticate('jwt-restaurant', { session: false }, (err, restaurant, info) => {
            //checking for errors
            if (err) {
                res.json({ err: err })
            }
            //checking for authorization issues in jwt-restaurant strategy
            if (info != undefined) {
                console.log(info.message)
                res.json({ error: info.message })

            } else {
                Restaurant.findOne({ _id: restaurant.id }, { customer: { $elemMatch: { _id: req.params.cid } } })
                    .then((data) => {
                        // index = data.customer[0].order.indexOf(req.params.did)
                        for (let i = 0; i < data.customer[0].order.length; i++) {
                            console.log("test" + data.customer[0].order[i]._id)
                            if (data.customer[0].order[i]._id == req.params.did) {
                                data.customer[0].order.splice(i, 1)
                                data.save()
                                console.log("deleted order data: " + i)
                                res.json({ customer: data })
                                //break otherwise we double delete
                                break
                            }
                        }
                        res.json(false)
                    })
                    .catch(err => {
                        res.json("Error in deleteOrder at restaurant.js: " + err)
                    })
            }
        })(req, res, next)

    },
    /* Customer logic */


}
