//File that contains functions that are not related to express, but still related to the app
const dotenv = require('dotenv');
dotenv.config({path : './config.env'}); //This command will read the variables on the config file and save them into node js envirnoment variables
//We need to 1st make the envirnoment variables be read from the congig file, before we require the app file (because we defined middleware for the development env in the app file and we need the env variables to be configured first for that)

const app = require('./app.js');

///////////////////////////////////////////////////////// 4. SERVER ///////////////////////////////////////////////////////////////
const port = process.env.PORT || 3000;
//to start up a server   // () => {...} the callback function that will be called as soon as the server starts listening
app.listen( port, () => {
    console.log(`App running on port ${port}...`);
})


//console.log(app.get('env')); // check the environment variable
//console.log(process.env); // check all the environemt variables (including the ones that we've defined in the config.env file)
//