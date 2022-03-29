import http from "http";
const PORT = 3000;

const server = http.createServer();

//EventEmitter class
server.on("request", (req, res) => {
  const friends = [
    { id: 0, name: "Chris" },
    { id: 1, name: "Idalia" },
    { id: 2, name: "Nicole" },
    { id: 3, name: "Noah" },
  ];
  //req is readable streams and res is a writale stream
  const params = req.url.split("/");

  if (req.method === "POST" && params[1] === "friends" && params.length < 3) {
    req.on("data", (data) => {
      console.log(data.toString());
      friends.push(JSON.parse(data.toString()));
    });
    req.pipe(res);
  }

  if (req.method == "GET" && params[1] === "friends" && params.length < 3) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(friends)); //signals that headers/body are done to be sent
  }
  if (params.length >= 3) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(friends[parseInt(params[2])]));
  }
  if (req.url === "/list") {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    res.write("<html>");
    res.write("<body>");
    res.write("</body>");
    res.write("<ul>");
    res.write("<li>Chris</li>");
    res.write("<li>Idalia</li>");
    res.write("<li>Nicole</li>");
    res.write("<li>Noah</li>");
    res.write("</ul>");
    res.write("</html>");
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});
server.listen(PORT, () => console.log(`server listen on port: ${PORT}`));
