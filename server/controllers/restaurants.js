const { json } = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require("mongodb"), ObjectId = mongodb.ObjectID
const Restaurant = mongoose.model('Restaurant')
const Customer = mongoose.model('Customer')
const Dish = mongoose.model('Dish')
// var ObjectId = mongoose.Types.ObjectId();

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
    //WORKING BUT finalize query to check for $ne
    //add dish to menu
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
    deleteDish: (req, res) => {
        //finds by id, then pulls from the "dish" key value, specifically query by _id given. also why $pull:dish.id didn't work. there was not dish.id field in restaurant
        //{new:true} explicitly states to return the new updated model instead of the old one before the update goes through
        Restaurant.findByIdAndUpdate(req.params.id, { $pull: { "dish": { _id: req.params.did } } }, { new: true })
            .then((updatedRestaurant) => {
                console.log("Updated restaurant: " + updatedRestaurant)

                res.json({ updatedRestaurant: updatedRestaurant })
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
    //TESTING NEW MODEL get one customer
    getCustomer: (req, res) => {

        Restaurant.findOne({ '_id': req.params.id })
            .populate({

                //when it populates the customer array by referencing the customer table by id, we choose only those that match the cid
                path: 'customer',
                match: { 'customer._id': req.params.cid },
                //NEW TESTING DEEP POPULATE
                // populate:{path:'customer._id'}
            })
            // .exec(function(err, customer){
            //          if (err) { return {error:err};}
            //         return res.status(200).json(customer.customer);
            // })
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
    //WORKING. TEST once addOrder works get ALL of ONE customer's orders
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
                    order: order
                    // .customer[0].order 
                })
            })
            .catch(err => {
                res.json("error in getCustomerOrders: " + err)
            })

    },


    //WORKING CHECK FOR BLANK order[] bug
    //Adds ONE order to a customer
    addOrder: (req, res) => {
        //assume we push the dish object as POST
        let dish = new Dish(req.body)
        /*db.collection.update(
            { "_id": ID, "playlists._id": "58"},
            { "$push": 
                {"playlists.$.musics": 
                    {
                        "name": "test name",
                        "duration": "4.00"
                    }
                }
            }
        ) */
        //no idea if this will work yet
        // Restaurant.update({ '_id': req.params.id}, {'customer':{$elemMatch:{'_id': req.params.cid }}},
        Restaurant.findOne({ '_id': req.params.id, 'customer': ObjectId(req.params.cid) },{ customer: { $elemMatch: { _id: req.params.cid } }})
            .then(data => {
                //no need to test for uniqueness since someone can get multiple dishes
                data.customer[0].order.push(dish)
                data.save()
                // returns -> {order[dishschema],_id:'customerid'}
                res.json({ "added order data": data.customer[0]})
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
    //TEST deletes order from customer
    deleteOrder: (req, res) => {
        let dish = new Dish()
        Restaurant.findOne({ '_id': req.params.id, 'customer': ObjectId(req.params.cid) }, { customer: { $elemMatch: { _id: req.params.cid } }})
        .then(data=>{

            index = data.customer[0].order.indexOf(req.params.did)
            if(index === -1){
                res.json({err:"dish does not exist"})
            }
            // //currently simple removing the last item
            // data.customer[0].order.splice(index,1)
            // data.save()
            res.json("deleted order data: "+index)
        })
        .catch(err=>{
            res.json("Error in deleteOrder at restaurant.js: "+err)
        })
    },

    /* Customer logic */


}
