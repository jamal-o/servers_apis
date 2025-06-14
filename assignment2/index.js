import { createServer } from "node:http";
import {
	createItem,
	getAllItems,
	getItem,
	updateItem,
	deleteItem,
} from "./handlers.js";

export const setId = (req) => {
	console.log(req.url);
	req.params = { id: req.url.split("/")[2] };
	console.log("Params: " + JSON.stringify(req.params));
};

const requestHandler = (req, res) => {
	const idPattern = /\/items\/(\d+)$/;
	// create item
	if (req.method === "POST" && req.url === "/items") {
		return createItem(req, res);
	}

	// get all items

	if (req.method === "GET" && req.url === "/items") {
		return getAllItems(req, res);
	}

	// get one item
	if (req.method === "GET" && idPattern.test(req.url)) {
		setId(req);
		return getItem(req, res);
	}

	// update item

	if (req.method === "PATCH" && idPattern.test(req.url)) {
		setId(req);
		return updateItem(req, res);
	}

	// delete item

	if (req.method === "DELETE" && idPattern.test(req.url)) {
		setId(req);
		return deleteItem(req, res);
	}

	// 404
	res.statusCode = 404;
	res.statusCode = 404;
	res.setHeader("Content-Type", "text/html");

	res.end(`
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Document</title>
				</head>
				<body>
					<h1>404 - Not Found</h1>
					<p>The requested page was not found on this server.</p>
					<p> These are the available paths:</p>
					<ul>
						<li><code>POST /items</code> - Create an item</li>
						<li><code>GET /items</code> - Get all items</li>
						<li><code>GET /items/:id</code> - Get one item by id</li>
						<li><code>PATCH /items/:id</code> - Update an item by id</li>
						<li><code>DELETE /items/:id</code> - Delete an item by id</li>
					</ul>
					Sample Item: <br>
						{    <br>
			name: "book1", <br>
			price: 50, <br>
			size: "s", // Acceptable values: "s", "m", "l" <br>
			id: "1", //ignored on create<br>
		},
				</body>
			</html>
		`);
};

const port = 3000;

const server = createServer(requestHandler);

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

export default server;
