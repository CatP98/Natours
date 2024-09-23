const fs = require('fs');
const express = require('express');

const app = express(); //a function which upon calling will add a bunch of methods and proprieties to app varaible

//Include the mniddleware -> what gives us access to the request data for a post, from the client
app.use(express.json()); //'express.json()' is middleware -> a funtion that can modify the incoming request data. A step that the request goes through to be processed

 // Sync, bc since it's a top level function, it will only be executed once and at the beginning of the node process
const tours =  JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


//The Route handler for a GET
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({ //JSend format
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
});

//Route Handler that accepts a variable
app.get('/api/v1/tours/:id/:x?', (req, res) => {
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
});

//The Route Handler for a POST (to create a new tour)
app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
})

app.delete('/api/v1/tours/:id', (req, res) => {
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
})

//Start the server
const port = 3000;
//to start up a server   // () => {...} the callback function that will be called as soon as the server starts listening
app.listen( port, () => {
    console.log(`App running on port ${port}...`);
})





//Create the Routing -> to determine how an application responds to a certain cliemt request (a certain hhtp method + url)

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({message: 'Hello from the Server Side', app: 'Natours'}); //when calling json, the content-type of the response, will automatically be set to 'application/json;' by Express, no need to specify the type of the content so that the browser knows what to expect 

// });

// app.post('/', (req, res) => {
//     res.send('You can post ro this endpoint...')
// })