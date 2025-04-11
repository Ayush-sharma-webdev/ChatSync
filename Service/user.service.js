const userModel = require('../Models/user.model');

module.exports.createUser = async ({ fullname , email , password })=>{
    if( !fullname || !email || !password ){
        throw new Error('All Fields Are Required.');
    };

    const user = await userModel.create({
        fullname : fullname,
        email : email,
        password : password
    });

    return user;
};