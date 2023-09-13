const fs = require("fs");
const express = require("express");
const app = express();

const PORT = 8080;

app.use(express.static("public"));
app.use(express.json());

let teamTable = {};
let locations = fs.readdirSync("challenges").sort();

app.post("/load", (req, res) => {
    let [teamName, teamLocation] = getTeam(req);

    if (!(teamName in teamTable)) {
        teamTable[teamName] = [];
    }

    if (!locations.includes(teamLocation)) {
        res.send(
            { "error": "location does not exist" }
        );
        return;
    }

    if (teamTable[teamName].includes(teamLocation)) {
        res.send(
            { "error": "challenge already done" }
        );
        return;
    }

    res.send(
        {
            "error": null,
            "text": getChallenge(teamName, teamLocation)
        }
    );
});

app.post("/complete", (req, res) => {
    let [teamName, teamLocation] = getTeam(req);

    if (
        !locations.includes(teamLocation) ||
        teamTable[teamName].includes(teamLocation)
    ) {
        res.sendStatus(400);
        return;
    }

    teamTable[teamName].push(teamLocation);
    res.sendStatus(200);
});

app.get("/locations", (req, res) => {
    res.send(locations);
});

app.get("/scores", (req, res) => {
    let response = {};
    for (let teamName of Object.keys(teamTable)) {
        response[teamName] = calculateScore(teamName);
    }
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

function getTeam(req) {
    let { teamName, teamLocation } = req.body;
    teamName = teamName.toLowerCase().trim();
    teamLocation = teamLocation.toLowerCase().trim();
    return [teamName, teamLocation];
}

function getChallenge(teamName, teamLocation) {
    let string = teamName + teamLocation;
    let hash = 0;

    for (i = 0; i < string.length; i++) {
        hash += string.charCodeAt(i);
    }

    hash = hash % fs.readdirSync(`challenges/${teamLocation}`).length;

    return fs.readFileSync(`challenges/${teamLocation}/${hash}.txt`, { encoding: "utf-8" });

}

function calculateScore(teamName) {
    let score = 0;
    for (let i = 0; i < teamTable[teamName].length; i++) {
        score = score + parseInt(teamTable[teamName][i].slice(1));
    }
    return score
}
