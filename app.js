const fs = require('fs');
const express = require('express');
const morgan = require('morgan');


const app = express(); //a function which upon calling will add a bunch of methods and proprieties to app varaible

/////////////////////////////////////////////////////////////// 1. MIDDLEWARES//////////////////////////////////////////////////////////

//Include the mniddleware -> what gives us access to the request data for a post, from the client
app.use(morgan('dev'));

app.use(express.json()); //'express.json()' is middleware -> a funtion that can modify the incoming request data. A step that the request goes through to be processed

app.use((req, res, next) => { //like this, Express knows that we are defining a middleware funtion in here. Wuth the 3rd  arameter, express passes the next function into the middleware function and we can use it whenever we want it
    console.log("Hello from the middleware 😁! ");
    next();
});

app.use((req, res, next) => { //like this, Express knows that we are defining a middleware funtion in here. Wuth the 3rd  arameter, express passes the next function into the middleware function and we can use it whenever we want it
    req.requestTime = new Date().toISOString();
    next();
});


 // Sync, bc since it's a top level function, it will only be executed once and at the beginning of the node process
const tours =  JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/////////////////////////////////////////////////////////////// 2. ROUTE HANDLERS ///////////////////////////////////////////////////////////////

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({ //JSend format
        status: 'success',
        requestedAt: req.requestTime,
        result: tours.length,
        data: {
            tours
        }
    });
};

const getTourById = (req, res) => {
    //console.log(req.params); //re.params is where all the parameters defined in the url are stored
    const id = req.params.id * 1; //To convert the string id value that comes from the url, into a number
    const tour = tours.find(el => el.id === id); //find creates an array whit the key value of the matched results
    
    //if(id > tours.length){ //alternative
    if(!tour){
        return res.status(404).json({
            status: "fail",
            message: "Id Not Found"
        });
    }

    res.status(200).json({
        status: "success",
       data: {
            tour
       }
    })
};

const createTour = (req, res) => {
    //console.log(req.body);
    // Generate new ID
    const newId = tours[tours.length - 1].id + 1;
    
    // Create a new tour object with the new ID and the data from req.body
    const newTour = Object.assign({ id: newId }, req.body);

    // Add the new tour to the tours array
    tours.push(newTour); // now the array include the new tour

    //In order to persist that new tour in our tours-simple.json:
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours), 
        err => {
            res.status(201).json({
                status: "success",
                data: {
                    tour: newTour
                }
            })
        })
};

const updateTour = (req, res) => {
    if(req.params.id * 1 > tours.length){ 
        return res.status(404).json({
            status: "fail",
            message: "Id Not Found"
        });
    }
   
    res.status(200).json({
        status: "success",
        data: {
            tour: '<Updated Tour Here>' //placeholder
        }
    });
};

const deleteTour = (req, res) => {
    if(req.params.id * 1 > tours.length){ 
        return res.status(404).json({
            status: "fail",
            message: "Id Not Found"
        });
    }
   
    res.status(204).json({ //204: no content
        status: "success",
        data: null
    });
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route ius not yet defined"
    });
}

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route ius not yet defined"
    });
}

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route ius not yet defined"
    });
}

const upodateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    });
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined"
    });
}

//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id/:x?', getTourById);
//app.post('/api/v1/tours', createTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

/////////////////////////////////////////////////////////////// 3. ROUTES ///////////////////////////////////////////////////////////////
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser);

app
    .route('/api/v1/users/:id')
    .get(getUser)
    .patch(upodateUser)
    .delete(deleteUser);

/////////////////////////////////////////////////////////////// 4. SERVER ///////////////////////////////////////////////////////////////
const port = 3000;
//to start up a server   // () => {...} the callback function that will be called as soon as the server starts listening
app.listen( port, () => {
    console.log(`App running on port ${port}...`);
})



