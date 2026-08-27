const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },

    phone:{
     type: String,
     require: true   
    },

    house: String,
    bulding: String,
    street: String,
    city: String,
    state: String,
    pincode: String
});

module.exports = mongoose.model('user',
    userSchema
);
