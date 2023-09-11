const fs = require("fs")
const express = require("express");
const app = express();

const PORT = 8080;

let challenges = fs.readdirSync("./challenges");

app.use(express.static("public"));
app.use(express.json());

app.post("/load", (req, res) => {
    let { teamName, teamLocation } = req.body;
    console.log(teamName, teamLocation);
    res.send(`challenge for ${teamName} at ${teamLocation}`);
});

app.post("/complete", (req, res) => {
    let { teamName, teamLocation } = req.body;
    console.log(teamName, teamLocation);
    res.send(`challenge for ${teamName} at ${teamLocation}`);
});

app.listen(PORT, () => {
    console.log(challenges)
    console.log(`listening on port ${PORT}`)
});
