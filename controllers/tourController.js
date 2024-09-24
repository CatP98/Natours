const fs = require('fs');
const express = require('express');

const router = express.Router();  //tourRouter is a middleware and we want to use this specific middleware for the '/api/v1/tours' url -> it's like creatin a sub-app. THhe tourRouter only runs in this route '/api/v1/tours'

 // Sync, bc since it's a top level function, it will only be executed once and at the beginning of the node process
 const tours =  JSON.parse( 
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Param middleware to check id
exports.checkId = ((req, res, next, val) => {
    console.log(`Tour id is : ${val}`);
    if(req.params.id * 1 > tours.length){ 
        return res.status(404).json({
            status: "fail",
            message: "Id Not Found"
        });
    }
    next();
});
exports.checkName = (req, res, next) => {
    console.log(`Checking for 'name' in request body.`);
    if (!req.body.name) {
        return res.status(400).json({
            status: "fail",
            message: "Bad Request: You need a name to create a tour"
        });
    }
    next();
};

exports.checkPrice = (req, res, next) => {
    console.log(`Checking for 'price' in request body.`);
    if (!req.body.price || isNaN(req.body.price * 1)) {
        return res.status(400).json({
            status: "fail",
            message: "Bad Request: You need to provide a valid price"
        });
    }
    next();
};
exports.checkBody = (req, res, val) => {
    if(!!req.body.name ||req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "Bad Request: Missing name or pricer"
        })
    }
    next();
}

// ROUTE HANDLERS
exports.getAllTours = (req, res) => {
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

exports.getTourById = (req, res) => {
    //console.log(req.params); //re.params is where all the parameters defined in the url are stored
    const id = req.params.id * 1; //To convert the string id value that comes from the url, into a number
    const tour = tours.find(el => el.id === id); //find creates an array whit the key value of the matched results
    
    res.status(200).json({
        status: "success",
       data: {
            tour
       }
    })
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            tour: '<Updated Tour Here>' //placeholder
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({ //204: no content
        status: "success",
        data: null
    });
};