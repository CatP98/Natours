const mongoose = require('mongoose'); //to interact with the MongoDB database.
const dotenv = require('dotenv'); // loads environment variables from the .env file
const fs = require('fs'); //to read files from the file system

const Tour = require('./../../models/tourModel'); // Tour model is imported from tourModel.js and will represent the tour data in MongoDB

dotenv.config({ path: './config.env' }); //Environment variables are loaded using dotenv.config(), which fetches values like the database URL from a .env file

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
); //readFileSync returns a json string -> needs to be parsed in order to be used by the mongoose functions

const DB = process.env.DATABASE_LOCAL;

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})

	.then(() => console.log('DB connection successfull'));

const importData = async () => {
	try {
		await Tour.create(tours); //create method can only accept a js object or array
		console.log('Data imported to Database Successfully!');
		process.exit();
	} catch (err) {
		console.error('Error importing data', err);
	}
};

const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log('Data deleted from Database Successfully!');
		process.exit();
	} catch (err) {
		console.error('Error deleting data', err);
	}
};

if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
} else {
	console.log( "Command must contain one of the following options: '--import' or '--delete" );
};

