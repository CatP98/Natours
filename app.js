const express = require('express');

const app = express(); //a function which upon calling will add a bunch of methods and proprieties to app varaible

app.get('/', (req, res) => {
    res
        .status(200)
        .json({message: 'Hello from the Server Side', app: 'Natours'}); //when calling json, the content-type of the response, will automatically be set to 'application/json;' by Express, no need to specify the type of the content so that the browser knows what to expect 

});

app.post('/', (req, res) => {
    res.send('You can post ro this endpoint...')
})

//Start the server
const port = 3000;
//to start up a server   // () => {...} the callback function that will be called as soon as the server starts listening
app.listen( port, () => {
    console.log(`App running on port ${port}...`);
})

//Create the Routing -> to determine how an application responds to a certain cliemt request (a certain hhtp method + url)

