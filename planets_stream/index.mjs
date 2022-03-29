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
