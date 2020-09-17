const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant')
const Customer = mongoose.model('Customer')

module.exports = {
    all: async (req, res) => {
        try {
            const restaurants = await Restaurant.find();
            res.json({ restaurants: restaurants });
        }
        catch (err) {
            res.json(err);
        }
    },
    getOneById: (req, res) => {
        Restaurant.findById({ _id: req.params.id })
            .then((data) => {
                res.json({ restaurant: data })
            })
            .catch(err => res.json(err));
    },
    create: (req, res) => {
        const restaurant = new Restaurant(req.body);
        restaurant.save()
            .then((data) => {
                res.json({ newRestaurant: data });
            })
            .catch(err => res.json(err));
    },
    update: (req, res) => {
        Restaurant.updateOne({ _id: req.params.id }, req.body)
            .then((data) => {
                res.json({ updatedRestaurant: data });
            })
            .catch(err => res.json(err));
    },
    //TEST adds customer to restaurant ref
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
    //TEST gets ALL customers
    getCustomers: (req, res) => {
        //populates all of the customers from the customer table by referencing the userId's listed in the restaurant customer field
        Restaurant.findOne({ _id: req.params.id }).populate('customer')
            .exec(function (err, customers) {
                if (err) {
                    return handleError(err)
                }
                else {
                    //return all customers
                    res.json({ allCustomers: customer })
                }
            })
    },
    //TEST get one customer only ID
    getCustomer: (req, res) => {
        Restaurant.findOne({ _id: req.params.id })
            .findOne({ 'customer.type': req.params.cid })
            .then((customer) => {
                //return customer and theoretically the array of their orders
                res.json({ customer: customer })
            })
            .catch(
                err => res.json("error in getCustomer for restaurants.js: " + err)
            );
    },
    //TEST get all customer orders
    getCustomerOrders: (req, res) => {
        this.getCustomer(req, res)
            .then((customer) => {
                //returns all customer order
                res.json({ order: customer.order })
            })
    },
    //TEST UPDATES and pushes one order to a customer
    //possible solution
    // Person.update({'items.id': 2}, {'$set'OR we could use '$push': {
    //      maybe here, customer.$.order:'newdishtoadd'
    //
    //     'items.$.name': 'updated item2',
    //     'items.$.value': 'two updated'
    // }}, function(err) { ...
    // addCustomerOrder:(req,res)=>{
    //     Restaurant.findOne({_id:req.params.id})
    //     .then((restaurant)=>{
    //         restaurant.findOne({_id:req.params.cid})
    //         .then((customer)=>{
    //             customer.findOneAndUpdate
    //         })
    //     })
    // },
    //TEST deletes customer
    deleteCustomer: (req, res) => {
        //possible way to delete from the array of customerIds in restaurant model
        Restaurant.findByIdAndUpdate(
            //query.findOneAndUpdate(conditions, update, options, (optional callback))
            { _id: req.params.id }, { $pull: { 'customer': { _id: req.params.cid } } }, { safe: true, upsert: true }
            // secondary option to .then .catch
            // ,
            // function(err, restaurant){
            //     if (err) { return handleError(res, err); }
            //     return res.status(200).json(restaurant.customer);
            // }

        ).then((restaurant) => {
            return res.status(200).json({ customerIds: restaurant.customer })
        })
            .catch(err => {
                res.json("error in deleteCustomer in restaurants.js: " + err)
            });
        //example code
        // Node.findByIdAndUpdate(
        //     req.params.id, { $pull: { "configuration.links": { _id: req.params.linkId } } }, { safe: true, upsert: true },
        //     function(err, node) {
        //         if (err) { return handleError(res, err); }
        //         return res.status(200).json(node.configuration.links);
        //     });
        // };
    },
    delete: (req, res) => {
        Restaurant.findOneAndDelete({ _id: req.params.id })
            .then((data) => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    },
}
