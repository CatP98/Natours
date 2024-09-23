const fs = require('fs');
const express = require('express');
const router = express.Router();  //tourRouter is a middleware and we want to use this specific middleware for the '/api/v1/tours' url -> it's like creatin a sub-app. THhe tourRouter only runs in this route '/api/v1/tours'

 // Sync, bc since it's a top level function, it will only be executed once and at the beginning of the node process
 const tours =  JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS
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

// ROUTES
router
    .route('/')
    .get(getAllTours)
    .post(createTour);

router
    .route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;