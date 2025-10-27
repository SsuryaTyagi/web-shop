const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema =new Schema({
    name:{
        type:String,
        require:true
    },
        number:{
        type:Number,
        require:true
    },    email:{
        type:String,
        require:true,
        unique:true
    },
        password:{
        type:String,
        require:true
    }
});

const userModel = mongoose.model('user',UserSchema);
module.exports = UserSchema;