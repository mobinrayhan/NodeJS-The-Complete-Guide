const { writeFile } = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  const { url } = req;

  if (url === "/") {
    res.write(`
        <h1>Home Page</h1>
            <form action="/message" method="POST">
            <input type="text" name="message" />
            <button type="submit">Send</button>
        </form>
    `);
    return res.end();
  }

  if (url === "/message") {
    const body = [];
    req.on("data", (chunk) => body.push(chunk));

    req.on("end", (stream) => {
      const requestBody = Buffer.concat(body).toString();
      const message = requestBody.split("=").at(1);
      writeFile("message.txt", message, (err) => {
        console.error(err);
      });
    });

    res.writeHead(301, {
      location: "/",
    });
    return res.end();
  }

  res.write("<h1>Hello World</h1>");
});

server.listen(3000);
