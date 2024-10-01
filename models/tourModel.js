const mongoose = require('mongoose');

// Set the Schema
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	rating: {
		type: Number,
		default: 4.5,
	},
});

// Create the model out of the defined schema
const Tour = mongoose.model('Tour', tourSchema); // Convention: define the models in uppercase

module.exports = Tour;
