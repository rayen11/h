const mongoose = require("mongoose");
const User = mongoose.model("User", {
  name: String,
  last_name: String,
  email: String,
  pass: String,
  phone: String,
  idss:Array,
  img_profile:String,
  subs:Array,
  appareil:Array,
});
module.exports = User;
