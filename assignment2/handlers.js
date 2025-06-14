import { JsonDatabaseService } from "./JsonDatabaseService.js";
import { Item } from "./models.js";

export const deleteItem = (req, res) => {
	try {
		JsonDatabaseService.deleteItem(req.params.id);
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end();
	} catch (error) {
		res.statusCode = 400;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ message: error.toString() }));
	}
};

export const getItem = (req, res) => {
	try {
		const item = JsonDatabaseService.getItem(req.params.id);
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(item));
	} catch (error) {
		res.statusCode = 400;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ message: error.toString() }));
	}
};

export const getAllItems = (req, res) => {
	const items = JsonDatabaseService.getItems();
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(items));
};

export const createItem = (req, res) => {
	const body = [];
	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", () => {
		const data = Buffer.concat(body).toString();
		const item = JSON.parse(data);

		try {
			const newItem = JsonDatabaseService.createItem(item);
			res.statusCode = 201;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(newItem));
		} catch (error) {
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ message: error.toString() }));
		}
	});
};

export const updateItem = (req, res) => {
	const body = [];
	req.on("data", (chunk) => {
		body.push(chunk);
	});

	req.on("end", () => {
		const data = Buffer.concat(body).toString();
		let item = JSON.parse(data);
		item.id = req.params.id;

		try {
			const updatedItem = JsonDatabaseService.updateItem(item);
			console.log("updatedItem: " + JSON.stringify(updatedItem));
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(updatedItem));
		} catch (error) {
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({ message: error.toString() }));
		}
	});
};

