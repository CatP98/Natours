const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); //a function which upon calling will add a bunch of methods and proprieties to app varaible

/////////////////////////////////////////////////////////// 1. MIDDLEWARES//////////////////////////////////////////////////////////
//Include the mniddleware -> what gives us access to the request data for a post, from the client
//These are the middlewares that we want to apply to all of our routes

console.log(process.env.NODE_ENV);
//o define a middle ware to just happen for a certain environment -> while the process is running, it's variables are common to all files,
//that's why we have access to them in here, eventhough we've defined them in the server.js
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json()); //'express.json()' is middleware -> a function that can modify the incoming request data. A step that the request goes through to be processed
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	//like this, Express knows that we are defining a middleware function in here. With the 3rd  parameter, express passes the next function into the middleware function and we can use it whenever we want it
	console.log('Hello from the middleware 😁! ');
	next();
});

app.use((req, res, next) => {
	//like this, Express knows that we are defining a middleware funtion in here. Wuth the 3rd  arameter, express passes the next function into the middleware function and we can use it whenever we want it
	req.requestTime = new Date().toISOString();
	next();
});

/////////////////////////////////////////////////////////// 3. ROUTES ///////////////////////////////////////////////////////////////
//Mouting the Routers to the routes - linking the tour and user routers to the appropriate base routes middleware
//These are the middlewares that are specific to a router

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

//
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id/:x?', getTourById);
//app.post('/api/v1/tours', createTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);
