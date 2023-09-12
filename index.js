const fs = require("fs")
const express = require("express");
const app = express();
let obj = {
};

const PORT = 8080;

let challenges = fs.readdirSync("./challenges");

app.use(express.static("public"));
app.use(express.json());

app.post("/load", (req, res) => {
    let { teamName, teamLocation } = req.body;
    if (!(teamName in obj)) {
        obj[teamName] = []
    };

    score = calcScore(teamName)
    console.log(`hallo`)
    
    if (!obj[teamName].includes(teamLocation)) {
        res.send(score + `\n` + fs.readFileSync(`challenges/${teamLocation}/${stringToHash(teamName, teamLocation)}.txt`));
    }
    else {
        res.send(score + `\n` + `Bitte gebt einen neuen Standort ein`)
    }
});

app.post("/complete", (req, res) => {
    let { teamName, teamLocation } = req.body;
    if (!obj[teamName].includes(teamLocation)) {
        obj[teamName].push(teamLocation);
    }
    res.send(`challenge for ${teamName} at ${teamLocation}`);
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

function stringToHash(string, teamLocation) {

    let hash = 0;
    string = string +  teamLocation

    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
        hash += string.charCodeAt(i);

    }

    hash = hash % fs.readdirSync(`challenges/${teamLocation}`).length;
    return hash;
}

function calcScore(teamName){
    score = 0
    for (let i = 0; i < obj[teamName].length; i++) {
        score = score + parseInt(obj[teamName][i].slice(1))
      }
    return score
}
