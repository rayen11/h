const mongoose = require("mongoose");
const Post = mongoose.model("Post", {
    title:String,
    city: String,
    price: Number,
    des: String,
    image:Array,
    station:String,
    date:String,
    now:String,
    number:Number,
    id:String,
    comment:Array,
});

module.exports = Post;
