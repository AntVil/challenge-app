const fs = require("fs")
const express = require("express");
const app = express();

const PORT = 8080;

class Challenge{
    constructor(fileName) {
        this.locationId = parseInt(fileName.split(".")[0]);
        this.text = fs.readFileSync(`./challenges/${fileName}`, { encoding: "utf-8" });
    }
}

let challenges = fs.readdirSync("./challenges").map(fileName => new Challenge(fileName));

app.use(express.static("public"));

app.get("/challenge", (req, res) => {
    res.send(JSON.stringify(challenges[Math.floor(Math.random() * challenges.length)]))
});

app.listen(PORT, () => {
    console.log(challenges)
  console.log(`listening on port ${PORT}`)
});
