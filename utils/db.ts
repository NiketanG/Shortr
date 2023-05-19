/* This is a database connection function*/
// const mongoose = require("mongoose");
import mongoose, { Connection } from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!process.env.MONGO_URI) {
		throw new Error(
			"Please define the MONGO_URI environment variable inside .env"
		);
	}

	try {
		/* connecting to our database */
		if (!cached.promise) {
			cached.promise = mongoose
				.connect(process.env.MONGO_URI)
				.then((mongoose) => {
					return mongoose;
				});
		}
		cached.conn = await cached.promise;
		console.log("Connected to Database");
	} catch (error) {
		console.error("Error while connecting to Database");
		console.error(error);
	}
}

export default dbConnect;
