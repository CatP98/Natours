//File that contains functions that are not related to express, but still related to the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path : './config.env'}); //This command will read the variables on the config file and save them into node js envirnoment variables
//We need to 1st make the envirnoment variables be read from the congig file, before we require the app file (because we defined middleware for the development env in the app file and we need the env variables to be configured first for that)

const app = require('./app.js');


/////////////////////////////////////////////////// 5. Database /////////////////////////////////////////////////////////////////

// 1. Connect the app op a database
mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => 
        console.log('DB connection successfull'));

// 2. Set the Schema
const tourSchema = new mongoose.Schema( {
    name : {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    rating: {
        type: Number,
        default: 4.5
    }
})

//3. Create the model out of the defined schema
const Tour = mongoose.model('Tour', tourSchema) // Convention, define the models in uppercase

//4 .  Creting a new document, out of the Tour model -> testTour is an instance of Tour 
const testTour = new Tour({
    name: "The Camper",
    price: 997
});

testTour
    .save() // returns a promise
    .then(doc => {
    console.log(doc);
    })
    .catch(err => {
        console.log('ERRORR 😱😱😱😱', err.message);
    })

///////////////////////////////////////////////////////// 4. SERVER ///////////////////////////////////////////////////////////////
const port = process.env.PORT || 3000;
//to start up a server   // () => {...} the callback function that will be called as soon as the server starts listening
app.listen( port, () => {
    console.log(`App running on port ${port}...`);
})


//console.log(app.get('env')); // check the environment variable
//console.log(process.env); // check all the environemt variables (including the ones that we've defined in the config.env file)


