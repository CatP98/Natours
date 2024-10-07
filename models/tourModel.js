/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// Set the Schema
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			maxLength: [40, 'A tour name contain maximum 40 characters'],
			minLength: [10, 'A tour name must contain at leat 10 characters'],
			validate: {
				validator: function (val) {
					// Use validator.isAlpha to ensure the name contains only alphabetic characters -> from validator npm package
					return validator.isAlpha(val, 'en-US', { ignore: ' ' }); // Allows spaces between words
				},
				message:
					'A tour name must contain only alphabetic characters and spaces'
			}
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, 'A tour must have a duration']
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'A tour must have a maximum group size']
		},
		difficulty: {
			type: String,
			required: [true, 'A tour must have a difficulty'],
			enum: {
				values: ['easy', 'medium', 'difficult']
			}
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price']
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			max: [5, 'A rating must be below 5.'],
			min: [1, 'A rating must be above 1. ']
		},
		ratingsQuantity: {
			type: Number,
			default: 0
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (val) {
					return val < this.price; // Note: the this kword is only pointing to the current doc, whe we are creating a new doc
				},
				message:
					"The discount price should be below the tour's regular price, got {VALUE}."
			}
		},
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
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false
		}
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

//Mongoose middleware:

//  AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
	console.log(this.pipeline()); // presents an array with the match, group and sort stages
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	console.log(this.pipeline()); //this time, it presents 2 match stages + 1 group and 1 sort
	next();
});

// QUERY DOCUMENT
tourSchema.pre('find', function (next) {
	console.log('====================');
	console.log('Query middleware, here is the this, the query object: ');
	console.log('====================');
	console.log(this);

	console.log('====================');
	console.log('This line should print after the query object log.');
	next();
});

tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });

	this.start = Date.now();
	next();
});

tourSchema.post(/^find/, function (docs, next) {
	console.log(`This query took ${Date.now() - this.start} miliseconds`);
	next();
});

// DOCUMENT MIDDLEWARE,
tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

tourSchema.pre('save', (next) => {
	console.log('Will save document...');
	next();
});

tourSchema.post('save', function (doc, next) {
	//This post function gets access not only to the next method , but also to the just processed document
	console.log(doc);
	next();
});

// Create the model out of the defined schema
const Tour = mongoose.model('Tour', tourSchema); // Convention: define the models in uppercase

module.exports = Tour;
