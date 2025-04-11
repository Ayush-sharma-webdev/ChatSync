const mongoose = require('mongoose');

const connectToDB = async () => {
    return await mongoose.connect(process.env.MONGOURI).then(console.log('Connected to DB.')).catch(err => console.log(`Error in connection : ${err}`));
};

module.exports = connectToDB;