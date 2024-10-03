const mongoose = require('mongoose');

// Set the Schema
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		// eslint-disable-next-line prettier/prettier
		unique: true
	},
	duration: {
		type: Number,
		// eslint-disable-next-line prettier/prettier
		required: [true, 'A tour must have a duration']
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'A tour must have a maximum group size']
	},
	difficulty: {
		type: String,
		required: [true, 'A tour must have a difficulty']
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price']
	},
	ratingsAverage: {
		type: Number,
		default: 4.5
	},
	ratingsQuantity: {
		type: Number,
		default: 0
	},
	priceDiscount: Number,
	summary: {
		type: String,
		trim: true,
		required: [true, 'A tour must have a summary.']
	},
	description: {
		type: String,
		trim: true
	},
	imageCover: {
		type: String,
		trim: true,
		required: [true, 'A tour must have a cover image.']
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false
	},
	startDate: [Date]
});

// Create the model out of the defined schema
const Tour = mongoose.model('Tour', tourSchema); // Convention: define the models in uppercase

module.exports = Tour;
