import mongoose from "mongoose";

export interface URLItem {
	dateCreated: string;
	user: string;
	visits: number;
	longUrl: string;
	urlCode: string;
	shortUrl: string;
	_id: string;
	title: string;
	countries: { [key: string]: number };
	referers: { [key: string]: number };
	timeline: { [key: string]: number };
}

const UrlSchema = new mongoose.Schema(
	{
		longUrl: {
			type: String,
			required: [true, "URL is required"],
		},
		urlCode: {
			type: String,
			required: [true, "URL Code is required"],
			unique: true,
		},
		shortUrl: {
			type: String,
			required: [true, "Short Url is required"],
			unique: true,
		},
		title: {
			type: String,
		},
		dateCreated: {
			type: String,
			required: true,
			default: new Date().toUTCString(),
		},
		user: {
			type: String,
			required: false,
			default: null,
		},
		visits: {
			type: Number,
			required: true,
			default: 0,
		},
		countries: {
			type: Object,
			required: true,
			default: {},
		},
		referers: {
			type: Object,
			required: true,
			default: {},
		},
		timeline: {
			type: Object,
			required: true,
			default: {},
		},
	},
	{ minimize: false }
);
const Url = mongoose?.models?.Url || mongoose?.model("Url", UrlSchema);

export default Url;
