const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 

const UserSchema =new mongoose.Schema({
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
UserSchema.methods.checkForValidPassword = async function(passwordByReqBody){

    const user = this;
     
    const isPasswordValid = await bcrypt.compare(passwordByReqBody, user.password);  
    
    return isPasswordValid;
     
 }


const userModel = mongoose.model('user', UserSchema);
module.exports = userModel;