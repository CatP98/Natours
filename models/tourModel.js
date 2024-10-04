const mongoose = require('mongoose');

// Set the Schema
const tourSchema = new mongoose.Schema(
	{
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
		startDates: [Date]
	},
	{
		toJSON: {
			virtuals: true
		},
		toObject: {
			virtuals: true
		}
	}
);

//virtual properties (a Mongoose property) define fields that do not get persisted in the database
tourSchema.virtual('durationWeeks').get(function () {
	//Using the regular function, because an arrow function does not get access to the this keyword. The this will be pointing to the current document
	return this.duration / 7;
});

// Create the model out of the defined schema
const Tour = mongoose.model('Tour', tourSchema); // Convention: define the models in uppercase

module.exports = Tour;
