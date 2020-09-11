const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant')
module.exports = {
    all: async (req, res) => {
        try {
            const restaurants = await Restaurant.find();
            res.json({restaurants: restaurants});
        }
        catch (err) {
            res.json(err);
        }
    },
    getOneById: (req, res) => {
        Restaurant.findById({ _id : req.params.id })
            .then((data) => {
                res.json({restaurant: data})
            })
            .catch(err => res.json(err));
    },
    create: (req, res) => {
        const restaurant = new Restaurant(req.body);
        restaurant.save()
            .then((data) => {
                res.json({newRestaurant: data});
            })
            .catch(err => res.json(err));
    },
    update: (req, res) => {
        Restaurant.updateOne({ _id : req.params.id }, req.body)
            .then((data) => {
                res.json({updatedRestaurant: data});
            })
            .catch(err => res.json(err));
    },
    delete: (req, res) => {
        Restaurant.findOneAndDelete({ _id : req.params.id })
            .then((data) => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    },
}
