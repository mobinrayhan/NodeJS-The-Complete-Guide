const http = require("http");
const fs = require("fs");

// function requestListener(req, res) {
//   console.log("-------------------------separator----------------");
//   console.log(req);
//   process.exit();
// }

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
    <head>
        <title>Document</title>
    </head>
    <body>
        <form action="/message" method="POST">
            <input type="text" name="message"/>
            <button type="submit">POST</button>
        </form>
    </body>
    `);

    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunks) => {
      console.log(chunks);
      body.push(chunks);
    });
    req.on("end", () => {
      const requestBody = Buffer.concat(body).toString();
      const message = requestBody.split("=")[1];
      console.log(message);

      fs.writeFileSync(
        "message.html",
        `
      <head>
          <title>Created  File By ME</title>
      </head>
      <body>
          <h1>${message}</h1>
      </body>
      `
      );
    });

    // res.statusCode = 302;

    res.writeHead(302, {
      location: "/",
    });

    return res.end();
  }

  res.setHeader("Content-Type", "text/html");
  res.write(`
    <head>
        <title>My First Node.js Server</title>
    </head>
    <body>
        <h1>Hello Node.js Message Page</h1>
    </body>
    
    `);
  res.end();
});
server.listen(1000);
