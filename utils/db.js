/* This is a database connection function*/
const mongoose = require("mongoose");

const connection = {}; /* creating connection object*/

async function dbConnect() {
	/* check if we have connection to our databse*/
	if (connection.isConnected) {
		return;
	}
	try {
		/* connecting to our database */
		const db = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
		connection.isConnected = db.connections[0].readyState;
		console.log("Connected to Database");
	} catch (error) {
		console.error("Error while connecting to Database");
		console.error(error);
	}
}

module.exports = dbConnect;
