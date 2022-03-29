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
