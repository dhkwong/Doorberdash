const mongoose = require('mongoose');
const Customer = mongoose.model('Customer')
module.exports = {
    all: async (req, res) => {
        try {
            const customers = await Customer.find();
            res.json({customers: customers});
        }
        catch (err) {
            res.json(err);
        }
    },
    getOneById: (req, res) => {
        Customer.findById({ _id : req.params.id })
            .then((data) => {
                res.json({customer: data})
            })
            .catch(err => res.json(err));
    },
    //WORKING
    create: (req, res) => {
        const customer = new Customer(req.body);
        customer.save()
            .then((data) => {
                res.json({newCustomer: data});
            })
            .catch(err => res.json(err));
    },
    update: (req, res) => {
        Customer.updateOne({ _id : req.params.id }, req.body)
            .then((data) => {
                res.json({updatedCustomer: data});
            })
            .catch(err => res.json(err));
    },
    delete: (req, res) => {
        Customer.findOneAndDelete({ _id : req.params.id })
            .then((data) => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    },
}
