import { Item } from "./models.js";

import fs from "node:fs";
// import json from "./items.json" with { type: "json" };
//json database service
export class JsonDatabaseService {
	// 	// STEP 1: Reading JSON file
	// const users = require("./users");

	// // STEP 3: Writing to a file
	// fs.writeFile(
	//     "items.json",
	//     JSON.stringify(users),
	//     err => {
	//         // Checking for errors
	//         if (err) throw err;

	//         // Success
	//         console.log("Done writing");
	//     });

	// static items = [
	// 	{
	// 		name: "book1",
	// 		price: 50,
	// 		size: "s",
	// 		id: "1",
	// 	},
	// 	{
	// 		name: "book1",
	// 		price: 50,
	// 		size: "s",
	// 		id: "2",
	// 	},
	// 	{
	// 		name: "book1",
	// 		price: 50,
	// 		size: "s",
	// 		id: "3",
	// 	},
	// ];

	static #readFile = () => {
		let content = fs.readFileSync("./items.json", "utf-8");
		return JSON.parse(content || "[]");
	};

	static #items = JsonDatabaseService.#readFile();

	static #saveFile = (newItems) => {
		try {
			fs.writeFileSync("./items.json", JSON.stringify(newItems));
			JsonDatabaseService.#items = newItems;
		} catch (error) {
			console.error("Error writing to file:", error);
			throw error;
		}

		// fs.writeFileSync("./items.json", JSON.stringify(newItems));
		JsonDatabaseService.#items = newItems;
	};

	static #appendFile = (newItems) => {
		fs.appendFileSync("./items.json", JSON.stringify(newItems));
		JsonDatabaseService.#items = newItems;
	};

	static getItem(id) {
		let item = JsonDatabaseService.#items.find((item) => item.id == id);

		if (item === undefined) {
			throw new Error("Item not found");
		}
		return item;
	}

	static getItems() {
		return JsonDatabaseService.#items;
	}

	static createItem(json) {
		let item = Item.fromJson(json);
		item.id = `${JsonDatabaseService.#items.length + 1}`;

		// JsonDatabaseService.#appendFile(item);
		JsonDatabaseService.#saveFile([...JsonDatabaseService.#items, item]);
		return JsonDatabaseService.#items;
	}

	static updateItem(json) {
		console.log(json);
		let item = Item.fromJson(json);

		var indexInDB = JsonDatabaseService.#items.findIndex(
			(value) => value.id === json.id
		);

		if (indexInDB === -1) {
			throw new Error("Item not found");
		}

		JsonDatabaseService.#saveFile([
			...JsonDatabaseService.#items.slice(0, indexInDB, 1),
			item,
			...JsonDatabaseService.#items.slice(indexInDB + 1, 1),
		]);

		return JsonDatabaseService.#items[indexInDB];
	}

	static deleteItem(id) {
		var indexInDB = JsonDatabaseService.#items.findIndex((i) => i.id == id);

		if (indexInDB === -1) {
			throw new Error("Item not found");
		}

		JsonDatabaseService.#saveFile([
			...JsonDatabaseService.#items.slice(0, indexInDB),
			...JsonDatabaseService.#items.slice(indexInDB + 1),
		]);
	}
}
