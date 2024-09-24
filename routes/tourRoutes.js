const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();  //tourRouter is a middleware and we want to use this specific middleware for the '/api/v1/tours' url -> it's like creatin a sub-app. THhe tourRouter only runs in this route '/api/v1/tours'

router.param('id', tourController.checkId);

// ROUTES
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkName, tourController.checkPrice, tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;