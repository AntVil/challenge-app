const fs = require("fs")
const express = require("express");
const app = express();

const PORT = 8080;

app.use(express.static("public"));
app.use(express.json());

let teamTable = {};
let locations = fs.readdirSync("challenges");

app.post("/load", (req, res) => {
    let [teamName, teamLocation] = getTeam(req);

    if (!locations.includes(teamLocation)) {
        res.send(
            JSON.stringify(
                { "error": "location does not exist" }
            )
        );
        return;
    }

    if (!(teamName in teamTable)) {
        teamTable[teamName] = []
    }

    if (!teamTable[teamName].includes(teamLocation)) {
        res.send(
            JSON.stringify(
                {
                    "error": null,
                    "text": getChallenge(teamName, teamLocation)
                }
            )
        );
    } else {
        res.send(
            JSON.stringify(
                { "error": "challenge already done" }
            )
        )
    }
});

app.post("/complete", (req, res) => {
    let [teamName, teamLocation] = getTeam(req);

    if (!locations.includes(teamLocation)) {
        res.sendStatus(400);
        return;
    }

    if (!teamTable[teamName].includes(teamLocation)) {
        teamTable[teamName].push(teamLocation);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.get("/scores", (req, res) =>{
    let response = {}
    for( let teamName of Object.keys(teamTable)){
        response[teamName] = calcScore(teamName)

    }
    res.send(JSON.stringify(response))
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

function getTeam(req) {
    let { teamName, teamLocation } = req.body;
    teamName = teamName.toLowerCase().trim();
    teamLocation = teamLocation.toLowerCase().trim();
    return [teamName, teamLocation]
}

function getChallenge(teamName, teamLocation) {
    let string = teamName + teamLocation;
    let hash = 0;

    for (i = 0; i < string.length; i++) {
        hash += string.charCodeAt(i);
    }

    hash = hash % fs.readdirSync(`challenges/${teamLocation}`).length;

    return fs.readFileSync(`challenges/${teamLocation}/${hash}.txt`, { encoding: "utf-8" })

}


function calcScore(teamName){
    score = 0
    for (let i = 0; i < teamTable[teamName].length; i++) {
        score = score + parseInt(teamTable[teamName][i].slice(1))
      }
    return score
}