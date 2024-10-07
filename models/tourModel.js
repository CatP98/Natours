/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const slugify = require('slugify');

// Set the Schema
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			// eslint-disable-next-line prettier/prettier
			unique: true
		},
		slug: String,
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

//QUERY DOCUMENT
tourSchema.pre('find', function (next) {
	console.log('====================');
	console.log('Query middleware, here is the this, the query object: ');
	console.log('====================');
	console.log(this);

	console.log('====================');
	console.log('This line should print after the query object log.');
	next();
});

// tourSchema.pre('find', function (next) {
// 	this.find({ secretTourTour: { $ne: true } });
// 	next();
// });

//the query middleware creates a query object, and from the moment of the pre hook until the post hook of a certain query, we get access to the same query object, with its set properties and methods, that we can use/access anytime we want in this process
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });

	this.start = Date.now(); //Setting a property with the time the object was creted and store it in the object on the 'start' attribute
	next();
});

tourSchema.post(/^find/, function (docs, next) {
	console.log(`This query took ${Date.now() - this.start} miliseconds`); //This will log the time it took from the moment the find query was triggered (right before the query got executes), until the moment the query finnished executing and, therefore, started the post middleware
	console.log(docs); // This will  log to the console all the documents that resulted in the query that started with 'find'
	next();
});

// DOCUMENT MIDDLEWARE,
// PRE-HOOKS: runs before .save() and .create() (other  like insertMant() for example will not trigger the function callback)
tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

tourSchema.pre('save', (next) => {
	console.log('Will save document...');
	next();
});

// POST-HOOKS: Post middleware functions are executed after all the pre middleware functions have completed
tourSchema.post('save', function (doc, next) {
	//This post function gets access not only to the next method , but also to the just processed document
	console.log(doc);
	next();
});

// Create the model out of the defined schema
const Tour = mongoose.model('Tour', tourSchema); // Convention: define the models in uppercase

module.exports = Tour;
