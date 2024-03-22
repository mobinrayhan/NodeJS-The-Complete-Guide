const fs = require("fs");

function requestHandler(req, res) {
  const { url, method } = req;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>Good Morning. Node.JS</h1>");

    res.write(`
      <form action="/create-user" method="POST">
          <input type="text" name="username" placeholder="Enter  Your User Name" />
          <button type="submit">POST</button>
      </form>
    `);
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
    <ul><li>User 1</li><li>User 2</li></ul>
    `);
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedData = Buffer.concat(body).toString();
      const userName = parsedData.split("=").at(1);
      fs.writeFile("username.txt", userName, () => {
        res.writeHead(301, {
          location: "/",
        });
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<h1>Good Morning. Node.JS</h1>");
  res.write(`
    <ul><li>User 1</li><li>User 2</li></ul>
    `);
  return res.end();
}

exports.handler = requestHandler;
