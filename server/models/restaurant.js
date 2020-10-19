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

    // customer: {CustomerSchema},
    //ref tells mongoose what model to use. In this case, Customer from customer.js where we assigned it in mongoose.model('Customer', CustomerSchema). 
    //all schemas have a default mongodb 24 character hex ID. the possible combinations are so high, collision is minimal. schema.Types.ObjectId uses that
    // Person
    // .findOne({ firstname: 'Aaron' })
    // .populate('eventsAttended') // only works if we pushed refs to person.eventsAttended. where eventsAttended is the referenced field here. Aka customer for us
    // .exec(function(err, person) {
    //     if (err) return handleError(err);
    //     console.log(person);
    // });

    //check if the order value can be created as such. otherwise we need to query the customer and add an ordered dishes field to customers to find all that coincide with restaurant
    customer: [{ _id:{type: Schema.Types.ObjectId, ref: 'Customer'}, order:[DishSchema]}],
    //TODO uniqueness in nested array of objects
    dish: [DishSchema],
    email:{type:String, required: true},
    password:{type:String, required: true}
}, {timestamps: true });
mongoose.model('Restaurant', RestaurantSchema);


