const mongoose = require('mongoose');


const mongo_Url = process.env.MONGO_CONN;

mongoose.connect(mongo_Url)
.then(()=>{
    console.log("databass is connected....");
}).catch((err)=>{
    console.log("databass connection error:",err);
})