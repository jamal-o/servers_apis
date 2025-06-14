const http = require("node:http");

// const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
	if (req.method === "GET" && req.url === "/index.html") {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html");

		// return a simple student page

		res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Student Page</title>
</head>
<body>
	<h1>Welcome to the Student Page</h1>
	<p>This is a simple HTML page for students.</p>
	<ul>
		<li>Student Name: John Doe</li>
		<li>Student ID: 123456</li>
		<li>Course: Computer Science</li>
	</ul>
</body>
</html>
`);
	} else {
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
				</body>
			</html>
		`);
	}
});

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
