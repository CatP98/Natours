/* eslint-disable prettier/prettier */
//const fs = require('fs');
//const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments, no-unused-vars
const Tour = require('./../models/tourModel');

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
	// const param = req.query.VALUE;
    // console.log(param);

    try {

        // BUILD THE QUERY
        // 1A) Filtering
        const  queryObj = {...req.query};
        const excludedFields = ['page', 'fields', 'limit', 'sort'];

        excludedFields.forEach(el => delete queryObj[el]) // Loop through the excludedFields array and delete those keys from queryObj
        console.log(queryObj);

        // rep.query from 127.0.0.1:3000/api/v1/tours?duration[gte]=5
        // - what we get: {duration: { 'gte' : '5'}} 
        // - what we want, in order to be executed by MongoDB: {duration: { $gte : 5}}
        // we need to replace - gte, gt, lt, lte - by - $gte, $gt, etc..

        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr)); // find() does not return the documents themselves, instead Tour.find() returns a Query object, on which we can further use methods like, sort(), limit(), etc -> Mongoose methods 
        
        // 2) SORT
        if(req.query.sort){
            console.log(req.query.sort);
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
            // In case we have a tie between price results and we want another field to serve as second criteria,  In mongoose, the sructure of the query would be sort('price ratingsaVERAGE') - (but since the space it's not supported in the url, we'll use a comma there, and in our code replace it by the space)
        } else {
            query = query.sort('-createdAt')
        }
    
        // 3) FIELD LIMITING
        // /tours?fields=name,duration

        if(req.query.fields){
            console.log(req.query.fields);
            const fields = req.query.fields.split(',').join(' ');
            console.log(fields);
            query = query.select(fields);
        } else {
            query.select(['-__v', '-_id']);
        }


        // 4) PAGINATION
        // /tours?page=2&limit=5
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query. skip(skip).limit(limit);

        if(req.query.page){
            const numTours = await Tour.countDocuments(); 
            if(skip >= numTours) {
                throw new Error( 'This page does not exist!' );
            }
        }

        // EXECUTE THE QUERY
        const tours = await query;

        // SEND RESPONSE
        res.status(200).json({
            // JSend format
            status: 'success',
            requestedAt: req.requestTime,
            result: tours.length,
            data: {
               tours
            }
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        })
    }
};

exports.getTourById = async (req, res) => {
	try {
        const tour = await Tour.findById(req.params.id); //findById is a helper function to : Tour.findOne({_id: req.params.id})
        res.status(200).json({
            // JSend format
            status: 'success',
            requestedAt: req.requestTime,
            data: {
               tour
            }
        });

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        })
    }
};

exports.createTour = async (req, res) => {
    try {

    const newTour = await Tour.create(req.body);

    // const newTour = new Tour({});
    // newTour.save();

	res.status(201).json({
	    status: "success",
	    data: {
	        tour: newTour
	    }
	});
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
	
};

exports.updateTour = async(req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
	
};

exports.deleteTour = async(req, res) => {
    console.log(`1. ${await Tour.countDocuments()}`); // Count documents instead of length

    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            data: null
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
    console.log(`1. ${await Tour.countDocuments()}`); // Count documents instead of length
};

//
//
// WHen it was used a JSON file with the data:
// Sync, bc since it's a top level function, it will only be executed once and at the beginning of the node process
//  const tours =  JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
//const router = express.Router();  //tourRouter is a middleware, and we want to use this specific middleware for the '/api/v1/tours' url -> it's like creating a sub-app. THhe tourRouter only runs in this route '/api/v1/tours'

//Param middleware to check id 
// exports.checkId = (req, res, next, val) => {
// 	console.log(`Tour id is: ${val}`);

// 	// if (req.params.id * 1 > tours.length) {
// 	//     return res.status(404).json({
// 	//         status: "fail",
// 	//         message: "Id Not Found"
// 	//     });
// 	// }
// 	next();
// }

// CHECKER FUNCTIONS no longer needed, since mongoose will do the check, of the body of the models, itself
// exports.checkBody = (req, res, next) => {
// 	// Added 'next' parameter
// 	// Check if both name and price are provided
// 	if (!req.body.name || !req.body.price) {
// 		// Use '!' for logical checks
// 		return res.status(400).json({
// 			status: 'fail',
// 			message: 'Bad Request: Missing name or price',
// 		});
// 	}
// 	next(); // Moved 'next()' inside the conditional to avoid errors
// }

// exports.checkName = (req, res, next) => {
// 	console.log(`Checking for 'name' in request body.`);

// 	if (!req.body.name) {
// 		return res.status(400).json({
// 			status: 'fail',
// 			// eslint-disable-next-line prettier/prettier
//       message: 'Bad Request: You need a name to create a tour'
// 		});
// 	}
// 	next();
// };

// exports.checkPrice = (req, res, next) => {
// 	console.log(`Checking for 'price' in request body.`);

// 	// Check if price exists and is a valid number
// 	const price = Number(req.body.price); // Convert to a number before checking
// 	if (!req.body.price || Number.isNaN(price)) {
// 		return res.status(400).json({
// 			status: 'fail',
// 			message: 'Bad Request: You need to provide a valid price',
// 		});
// 	}
// 	next();
// };

// exports.getAllTours = (req, res) => {
// 	console.log(req.requestTime);
// 	res.status(200).json({
// 		// JSend format
// 		status: 'success',
// 		requestedAt: req.requestTime,
// 		// result: tours.length,
// 		// data: {
// 		//     tours
// 		// }
// 	});
// };

// exports.getTourById = (req, res) => {
// 	// eslint-disable-next-line no-unused-vars
// 	const id = req.params.id * 1; // Convert the string id value from the URL to a number
// 	// const tour = tours.find(el => el.id === id); // Find the tour by id

// 	// Uncomment the following code to return the found tour
// 	// res.status(200).json({
// 	//     status: "success",
// 	//     data: {
// 	//         tour
// 	//     }
// 	// });
// };