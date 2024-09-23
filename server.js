//File that contains functions that are not related to express, but still related to the app
const app = require('./app.js');

/////////////////////////////////////////////////////////// 4. SERVER ///////////////////////////////////////////////////////////////
const port = 3000;
//to start up a server   // () => {...} the callback function that will be called as soon as the server starts listening
app.listen( port, () => {
    console.log(`App running on port ${port}...`);
})

