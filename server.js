const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT || 5000;
const ShortUrlLinks = require("./app/model/hash");
const { createShort } = require("./app/helpers/helpers");
app.set("view engine", "ejs");
app.use(express.static("public"));

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .use(express.json());
app.set("json spaces", 2);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

mongoose.connect(process.env.dburi);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to db"));

app.get("/", async (req, res) => {
  try {
    const data = "";
    //const shortenedUrl = "";
    res.render("index.ejs", { data /*, shortenedUrl */ });
  } catch (err) {
    console.log(err);
  }
});

app.get("/showLinks", async (req, res) => {
  try {
    const data = await readFromDb();
    //res.status(200).json({ data });
    res.render("display.ejs", { data });
  } catch (err) {
    console.error(err);
  }
});

app.get("/:shortLink", async (req, res) => {
  try {
    const data = await readFromDb("shortUrl", req.params.shortLink);
    if (data) {
      res.status(301).redirect(data.longUrl);
    } else {
      res.status(301).send(`${req.params.shortLink} is not a valid short link`);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  try {
    const reqBody = req.body;
    let randomDate = new Date();
    let randomNum = Math.random() * 100000;
    //console.log(`${reqBody.longUrl}${randomizeDate}${randomizeNum}`);
    let shortUrl = "https://www.short-ly.com/";
    if (reqBody.randomize === "on") {
      shortUrl += createShort(`${reqBody.longUrl}${randomDate}${randomNum}`);
    } else {
      shortUrl += createShort(reqBody.longUrl);
    }
    writeToDb(reqBody.longUrl, shortUrl);
    if (!shortUrl) {
      res.status(400).send(`${reqBody.longUrl} is not a valid link !!!`);
    }

    const data = shortUrl;
    res.render("index.ejs", { data });
  } catch (err) {
    console.log(err);
  }
});

const readFromDb = async (key, value) => {
  if (key != undefined && value != undefined) {
    return await ShortUrlLinks.findOne({ [key]: value });
  } else {
    return await ShortUrlLinks.find().lean();
  }
};

const writeToDb = async (longUrl, shortUrl) => {
  const query = { shortUrl: shortUrl };
  const updated_at = Date.now();
  const update = {
    $set: {
      longUrl,
      shortUrl,
    },
    updated_at,
  };

  return await ShortUrlLinks.findOneAndUpdate(query, update, { upsert: true });
};

module.exports = app;
