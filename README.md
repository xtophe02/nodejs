# NODE JS

**Is an asynchronous event-driven javascript runtime**

Nodejs (non-blockin I/O) runtime has,

- a V8 Javascript engine (parse javascript),
- APIs has fs, http, path, crypto (that leaves in libuv)
- bindings, calls async/sync in C++ between libuv and V8
- a [Libuv](https://libuv.org/), the input output tasks.

### REPL - *R*ead *E*val *P*rint *L*oop

### _Browsers has window object and nodejs has global object_

## process.argv[]

```
node hello.js test
const p =  process.argv[2]

result: p = test
```

## ASYNC

```
global.setTimeout(() => console.log("🐇 finishes!"), 1000); // _settime accepts as argument a callback_
global.console.log("🐢 finishes!");

result:
🐢 finishes!
🐇 finishes!
```

> JS out of the box is **Synchronous** but it has **APIs** _to call_ **LIBUV** that can execute code **Asynchronous**

## THREADS

- a process shares memory and thread but not the call stacks
- threads can run on diferent processors of the CPU
- threads run in paralel
- **javascript** is a single thread language, so no deadlocks
- the javascript code is run on main thread, and the async code is put on event loop
- **libuv** that executes the async calls, has a pool o threads
- nodejs process has 1x main thread (_engine_) + pool of thread _4x by default_
- threads are reused, so no creation or destruction of new threads
- **only a few async I/O uses the thread pool** example file system.
- LIVUB network I/O, doesn't use the thread pool, instead uses the core system that has multi-thread (_the kernel is does the multithread realy well_) and then it will signal the event loop
- as developer, we do not take care the multi-thread, nodejs will do it.

## EVENT LOOP

leaves in libuv
**processes all callbacks until the program exits**

```
while(!shouldExit){
  processEvents()
}
```

## CALLBACKS QUEUES

**_executed in first in first out queue_**
processed in background. LIBUV will send to the pool of threads or into the core system.
_there are others phases but they are internal_

**event loop phases** queues _each one has its own queues of callbacks_

loops in:
1 timers (setTimeout, setInterval)
2 I/O callbacks // pool queue
3 setImmediate
4 close callbacks

## OBSERVER PATERN

_relation one-to-many_

```
const EventEmitter = require("events");
const celebrity = new EventEmitter();

//Subscrive to celebrity for observer 1
celebrity.on("race", (res) => {
  if (res === "win") {
    console.log("🎉 Congratulations!");
    return;
  }
  console.log("✨");
});
//Subscrive to celebrity for observer 2
celebrity.on("race win", () => console.log("😎 you are the best there is"));

process.on("exit", (code) => console.log("Process exit on code:", code));

celebrity.emit("race win");
celebrity.emit("race", "win");

```

## MODULES

- module.exports = {test} : to export func test
- const mod = require('./test') : to import the test func
- with ecma
  - import {test} from './test**.mjs**'
  - export {test}
- modules are cached. _leaves on require.cache_
- index.js treats folders as module **Ryan Dahl, is against, index.js brings complex**

```
//index.js
module.exports={
  ...require('./test')
  ...require('./test2')
}
```

## STREAM API

for huge data. is based on event emitter.
**readable.pipe(writable)**

```
import { parse } from "csv-parse";
import fs from "fs";

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// fs.createReadStream return event 'end' or 'data' etc
fs.createReadStream("./kepler_data.csv")
  //pipe is meant to connect readable stream to a writable stream
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => console.log("ERROR:", err))
  .on("end", () => {
    console.log(`${habitablePlanets.length} habitable planets found!`);
    console.log("we are done");
  });
```

## HTTP SERVER

### Same origin

example : (1)https:// (2)www.google.com (3):443 /maps

if one of the 3x things changes, we are not in same origin

**same origin policy from javascript** for instance, to avoid facebook steal data from google, meaning, when I'm on google, facebook cannot access my browser at the moment.

on the browser I'm on google.com, if I request from wikipedia from google, javascript will allow, because is a response from google.
now, if I'm still on google.com and I fetch \*_from browser terminal_ wikipidia, I will be blocked by CORS.

### CORS. Cross Origin Resource Sharing

Access-Control-Allow-Orign: [whitelist]

example on [Github/http server](https://github.com/xtophe02/nodejs)

```
import http from "http";
const PORT = 3000;

//EventEmitter class
const server = http.createServer();
server.on("request", (req, res) => {
  const friends = [
    { id: 0, name: "Chris" },
    { id: 1, name: "Idalia" },
    { id: 2, name: "Nicole" },
    { id: 3, name: "Noah" },
  ];
  //req is readble streams and res is a writale stream
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

```

## NODE CSV READER

**csv-reader**: package to read csv files

example on [Github/csv](https://github.com/xtophe02/nodejs) under planets stream folder

## EXPRESS

_how to stay organized if you project get bigger_

![folder structure](express-folder-structure.png)

example on [Github/express](https://github.com/xtophe02/nodejs) under express folder

## EXPRESS - SECURITY

- **login/logout**: with google
- **https**: add your own SSL TLS certificates
- **protected routes**: middleware to protect routes. only authenticated users can access
- **error handling**: redirect if not authenticated or authorized

### dependecies

- **dotenv** : to avoid upload secrets
- **cookie-session**: send secure cookies to clients
- **passport-google-ouath20** : sign with google accounts
- **helmet**: middleware to prevent leak info from server

example on [Github/express-security](https://github.com/xtophe02/nodejs) under security folder

## EXPRESS - PERFORMANCE

### CLUSTERING

**N PROCESSES AND N NODE INSTANCES**

- **pm2** : for clustering. PM2 will automaticaly create independentant workers, one per cpu core, and perform load balance. its a great tool for _zero downtime restart_, meaning, if you need to restart workers, no need to restart all of them at same time, so your app can run without being off.

example on [Github/express-performance](https://github.com/xtophe02/nodejs) under performace folder

### WORKER THREADS

**1 PROCESS AND N NODE INSTANCES**
is built-in package from nodejs. those can share memory. because is the same process.

example on [Github/express-performance](https://github.com/xtophe02/nodejs) under workers folder

## GRAPHQL - APOLLO SERVER

_how to stay organized if you project get bigger_

![folder structure](graphql-folder-structure.png)

example on [Github](https://github.com/xtophe02/nodejs) under graphql folder
