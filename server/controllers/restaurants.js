const { json } = require('body-parser');
const mongoose = require('mongoose');
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
    //WORKING get one customer
    getCustomer: (req, res) => {

        Restaurant.findOne({ '_id': req.params.id })
            .populate({
                //when it populates the customer array by referencing the customer table by id, we choose only those that match the cid
                path: 'customer',
                match: { _id: req.params.cid }
            })
            // .exec(function(err, customer){
            //          if (err) { return {error:err};}
            //         return res.status(200).json(customer.customer);
            // })
            .then((customer) => {
                //return customer
                console.log("testing: " + customer)
                //returns as just the object vs the array in the object. {customer} vs [{customer}]
                res.json({ customer: customer.customer[0] })

            })
            .catch(err => {
                res.json("getCustomer error in restaurants.js: " + err)
            })

    },
    //WORKING adds customer ID to restaurant ref BUT returns null currently
    addCustomer: (req, res) => {
        Customer.findById({ _id: req.params.cid })
            .then((customer) => {
                let newcustomer = new Customer(customer)
                Restaurant.findOne({ _id: req.params.id })
                    .then(restaurant => {
                        //may need to let restaurant1 = restaurt
                        //returns a restaurant, which we push the new customer to the array of customers in the restaurant 'customer' field
                        restaurant.customer.push(newcustomer);
                        restaurant.save((data) => {
                            res.json({ newCustomer: restaurant.customer })

                        })
                            .catch(
                                err => res.json("error in addCustomer for restuarants.js: " + err)
                            );
                    })
            })

    },
    //WORKING to see if findbyidandupdate works for deleting a customer
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
    //TEST get ALL of ONE customer's orders maybe I need to add orders first. probably dont need to populate here. just match the ID. we're not returning the customer data, just the order
    /*
        Library.find({
        'id': libraryID,
        'collections.id': CollectionID,
        'collections.subCollections.id': subCollectionID
        }, { 'collections.subCollections.$': 1 }, function(err, data) {
        console.log(err, data);
        })
    */
   //I'm trying to do this without populate, but theoretically it shouldnt matter if I just  ADD THE DISH FIRST then populate will show the customer data AND the dishes
    getCustomerOrders: (req, res) => {
        // Restaurant.find({"_id":req.params.id,"customer":req.params.cid})
        // Restaurant.find({_id:req.params.id},{$lookup:{from:'Customer', localField:'customer',foreignField:'_id', as:"data"}})
        // Restaurant.find({_id:req.params.id},{customer:{$in:[req.params.cid]}})

        //returns just the restaurant. Still work in progress
        Restaurant.aggregate([{$lookup:{
            from:'Customer',

            // path:'customer',
            pipeline:[
                {$match:
                    {'customer':
                        
                            [req.params.cid]
                        
                    }
                }
            ],
            as:"customer"
        }}])
        .then(order=>{
            res.json({order:order})
        })
        .catch(err=>{
            res.json("error in getCustomerOrders: "+err)
        })
        // //returns the restaurant id
        // Restaurant.find({ _id: req.params.id, 'customer': req.params.cid }, { 'customer.order': 0 })

    },
    //TEST adds order to customer. reference getCustomer for query, possibly sans populate and populate function
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
        Restaurant.update({ '_id': req.params.id, 'customer._id': req.params.cid }, {
            '$push':
            {
                //theoretically pushed dish to the customer found's order array of customer:[DishSchema]
                'customer.$.order': dish
            }
        })
    },
    //TEST deletes order from customer
    deleteOrder: (req, res) => {
        let dish = new Dish()
        Restaurant.update({ '_id': req.params.id, 'customer._id': req.params.cid }, {
            '$pull':
            {
                //theoretically pushed dish to the customer found's order array
                'customer.$.order': dish
            }
        })
    },

    /* Customer logic */


}
