const mongoose = require('mongoose');
Schema = mongoose.Schema;
const CustomerSchema = require('../models/customer');

//console.log("test: "+JSON.stringify(test))
// const Dish = mongoose.model('Dish')

// const Story = mongoose.model('Story', storySchema);
// const Person = mongoose.model('Person', personSchema);
const DishSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, default: ''},
    time: {type: Number, default:0}
})
mongoose.model('Dish', DishSchema)
const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, default: '', required: true},
    //check if the order value can be created as such. otherwise we need to query the customer and add an ordered dishes field to customers to find all that coincide with restaurant
    customer: [{ _id:{type: Schema.Types.ObjectId, ref: 'Customer'}, order:[DishSchema]}],
    //TODO uniqueness in nested array of objects
    dish: [DishSchema],
    email:{type:String, required: true},
    password:{type:String, required: true}
}, {timestamps: true });
mongoose.model('Restaurant', RestaurantSchema);


   