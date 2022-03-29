import path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import helmet from "helmet";
import { URL } from "url"; // in Browser, the URL in native accessible on window
import { Strategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
dotenv.config();

// const __filename = new URL('', import.meta.url).pathname;
// Will contain trailing slash
const __dirname = new URL(".", import.meta.url).pathname;

const PORT = 3000;

const app = express();

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("Google Profile", profile);
      return cb(null, profile);
    }
  )
);
function checkLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must log in!" });
  }
  next();
}

app.use(helmet());
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
  })
);
//INITS A passport session
app.use(passport.initialize());

//PASSPORTS UNDERSTAND COOKIE-SESSION AND SETS THE REQ.USER.AUTHENTICATES SESSION SENT TO OUR SERVER
app.use(passport.session());

//SERIALIZE. SAVE SESSION from google, TO COOKIE
passport.serializeUser((user, cb) => cb(null, user.id));

//DESERIALIZE. LOAD SESSION FROM COOKIE TO BE READ
passport.deserializeUser((obj, cb) => {
  //USER.findbyID(id).then(user=>cb(null,user))//from user.id
  cb(null, obj);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => console.log("Google called us back!")
);
app.get("/auth/logout", (req, res) => {
  req.logOut();
  return res.redirect("/");
});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("your secret is... there is no secret!");
});

app.get("/failure", (req, res) => {
  res.status(401).send("Failure to login");
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
//openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(PORT, () => console.log(`listening on port ${PORT}`));
