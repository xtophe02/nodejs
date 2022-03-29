import express from "express";
import path from "path";
import * as url from "url";

import { getMessage } from "./controllers/message.controller.mjs";
import famliyRouter from "./routes/family.router.mjs";

const PORT = 3000;
const app = express();
// const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

//template engines
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use((req, res, next) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method}:${req.baseUrl}${req.url}-${delta}ms`);
});

//middleware to serve static files
app.use("/", express.static(path.join(__dirname, "public")));

//middleware: add req.body for json
app.use(express.json());

app.get("/", (req, res) => {
  // res.send("<h1>Hello World</h1>");
  res.render("index", {
    title: "Family",
    caption: "LOGO picture",
  });
});
app.get("/message", getMessage);

app.use("/family", famliyRouter);

app.listen(PORT, () => console.log(`listening port ${PORT}`));
