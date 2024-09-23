const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();  //tourRouter is a middleware and we want to use this specific middleware for the '/api/v1/tours' url -> it's like creatin a sub-app. THhe tourRouter only runs in this route '/api/v1/tours'


// ROUTES
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;