
const mongoose = require('mongoose');

const MongoConnection = async() => {    
    await mongoose.connect(process.env.MONGO_CONN);
}


module.exports = MongoConnection;