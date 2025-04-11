const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    token : {
        type : String,
        unique : true,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expireIn : 86400
    }
});

const blackListTokenModel = mongoose.model('BlackToken' , blackListTokenSchema);

module.exports = blackListTokenModel;