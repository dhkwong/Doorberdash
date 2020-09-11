const mongoose = require('mongoose');
const CustomerSchema = require('../models/customer');
let test = CustomerSchema
console.log("test: "+JSON.stringify(test))
// const Dish = mongoose.model('Dish')
const DishSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, default: ''},
    time: {type: Number, default:0}
})
mongoose.model('Dish', DishSchema)
const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, default: ''},
    //apparently you can't put a schema in another schema. Look up how it's done...idk if that's the solution. figure out module.export
    customer: {CustomerSchema},
    dish: {DishSchema}
}, {timestamps: true });
mongoose.model('Restaurant', RestaurantSchema);

