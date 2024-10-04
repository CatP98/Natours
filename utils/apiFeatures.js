class APIFeatures {
	constructor(query, queryString) {
		//- query - is the mongoose query, the one we pass to mongoose after the needed manipulation (sorting, filtering, etc), - queryString - the express query, we get access to it with req.query. The one received from the client, ('...?sort=price&filter=....') also, the one that we will manipulate and prepare to be sent to mongoose
		this.query = query;
		this.queryString = queryString;
		console.log(queryString);
		console.log(query);
	}

	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ['page', 'fields', 'limit', 'sort'];

		excludedFields.forEach((el) => delete queryObj[el]); // Loop through the excludedFields array and delete those keys from queryObj

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`
		);
		console.log(JSON.parse(queryStr));

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		// 2) SORT
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
			// In case we have a tie between price results and we want another field to serve as second criteria,  In mongoose, the sructure of the query would be sort('price ratingsaVERAGE') - (but since the space it's not supported in the url, we'll use a comma there, and in our code replace it by the space)
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');

			this.query = this.query.select(fields);
		} else {
			this.query.select(['-__v', '-_id']);
		}
		return this;
	}

	paginate() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;
