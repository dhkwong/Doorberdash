const mongoose = require('mongoose');
const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true},
    address: {
        street: String,
        city: String,
        state: {
            type: String,
            uppercase: true,
            required: true,
            enum: statesArray
        },
        zip: Number
    },
    email:{type: String, required:true /*, regex for email here */},
    password:{type: String, required:true /*regex for pass here */}
    //restaurants[restaurants currently ordered from. possibly populate to find the orders]
}, {timestamps: true })

mongoose.model('Customer', CustomerSchema);
// export a type schema named CustomerSchema
module.exports.CustomerSchema=CustomerSchema;
