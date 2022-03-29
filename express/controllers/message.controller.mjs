import path from "path";
import { __dirname } from "../server.mjs";

//for debuging is better to have function
export function getMessage(req, res) {
  // res.send("<h1>Hello World</h1>");
  // res.sendFile(path.join(__dirname, "..", "public", "images", "logo.png"));
  res.render("message", {
    title: "Message",
    member: "Chris",
  });
}
