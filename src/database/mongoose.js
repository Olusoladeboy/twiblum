const mongoose = require('mongoose');

const db_url = 'mongodb://127.0.0.1:27017/twiblum';
// const db_url = 'mongodb+srv://Olusola:olusola10000@cluster0-lo248.mongodb.net/Twiblum?retryWrites=true&w=majority';


mongoose.connect(db_url, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
).catch(err => {
    console.log(err.message)
})