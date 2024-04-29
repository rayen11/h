const mongoose = require("mongoose");
const Filter = mongoose.model("Filter", {
    city: String,
    price: Number,
    time:String,
    date:String,
    number:Number,
    ids:String
});

module.exports = Filter;
