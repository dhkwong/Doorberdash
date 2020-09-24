const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant')
const Customer = mongoose.model('Customer')
const Dish = mongoose.model('Dish')

module.exports = {
    /*Restaurant logic */
    //WORKING
    all: async (req, res) => {
        try {
            const restaurants = await Restaurant.find();
            res.json({ restaurants: restaurants });
        }
        catch (err) {
            res.json(err);
        }
    },
    //WORKING
    getOneById: (req, res) => {
        Restaurant.findById({ _id: req.params.id })
            .then((data) => {
                res.json({ restaurant: data })
            })
            .catch(err => res.json(err));
    },
    //WORKING
    create: (req, res) => {
        const restaurant = new Restaurant(req.body);
        restaurant.save()
            .then((data) => {
                res.json({ newRestaurant: data });
            })
            .catch(err => res.json(err));
    },
    //WORKING
    update: (req, res) => {
        Restaurant.updateOne({ _id: req.params.id }, req.body)
            .then((data) => {
                res.json({ updatedRestaurant: data });
            })
            .catch(err => res.json(err));
    },
    //WORKING
    delete: (req, res) => {
        Restaurant.findOneAndDelete({ _id: req.params.id })
            .then((data) => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    },
    //WORKING add dish to menu
    addDish: (req, res) => {
        newdish = new Dish(req.body)
        Restaurant.updateOne({ _id: req.params.id }, { $push: { dish: newdish } })
            .then((updatedRestaurant) => {
                if (updatedRestaurant.ok === 1)
                    res.json({ updatedRestaurant: true })
            })
            .catch(err => {
                res.json("addDish error in restaurants.js: " + err)
            })

        // Restaurant.findOne({ _id: req.params.id })
        //     .then((restaurant) => {
        //         restaurant.dish.push(newdish)
        //         restaurant.save((updatedRestaurant) => {
        //             res.json({ updatedRestaurant: updatedRestaurant })
        //         })
        //             .catch(err => {
        //                 res.json("addDish error in restaurants.js: " + err)
        //             })
        //     })
    },

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

    //WORKING get one customer only ID. currently only finds the restaurant. Probably can't method chain .findOne in mongoose
    getCustomer: (req, res) => {
        // Restaurant.findOne({ _id: req.params.id })
        //     .findOne({ 'customer': req.params.cid })
        //     .then((customer) => {
        //         //return customer and theoretically the array of their orders
        //         res.json({ customer: customer })
        //     })
        //     .catch(
        //         err => res.json("error in getCustomer for restaurants.js: " + err)
        //     );
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


    //WORKING to see if findbyidandupdate works for deleting a customer
    deleteCustomer: (req, res) => {
        Restaurant.findOneAndUpdate(
            //query.findOneAndUpdate(conditions, update, options, (optional callback))
            { _id: req.params.id}
            // secondary option to .then .catch
            // ,
            // function(err, restaurant){
            //     if (err) { return handleError(res, err); }
            //     return res.status(200).json(restaurant.customer);
            // }

        ).then((restaurant) => {
            var index = restaurant.customer.indexOf(req.params.cid)
            console.log(restaurant.customer)
            console.log(index)
            //should work to delete all dishes of the customer's as well, since you're deleting the entire object at the index
            restaurant.customer.splice(index, 1);
            restaurant.save();
            //returns restaurant
            return res.status(200).json({ updatedRestaurant: restaurant})
        })
            .catch(err => {
                res.json("error in deleteCustomer in restaurants.js: " + err)
            });
    },
    //TEST get all customer orders
    getCustomerOrders: (req, res) => {
        this.getCustomer(req, res)
            .then((customer) => {
                //returns all customer order
                res.json({ order: customer.order })
            })
    },
    /* Orders Logic */
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
    //WORKING adds customer ID to restaurant ref BUT returns null currently
    addCustomer: (req, res) => {
        //find customer
        Customer.findById({ _id: req.params.cid })
            .then((customer) => {
                let newcustomer = new Customer(customer)
                Restaurant.findOne({ _id: req.params.id })
                    .then(restaurant => {
                        //may need to let restaurant1 = restaurt
                        //returns a restaurant, which we push the new customer to the array of customers in the restaurant 'customer' field
                        restaurant.customer.push(newcustomer);
                        restaurant.save((data) => {
                            res.json({ newCustomer: data })

                        })
                            .catch(
                                err => res.json("error in addCustomer for restuarants.js: " + err)
                            );
                    })
            })

    },

}
