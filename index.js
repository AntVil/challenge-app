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
    console.log(teamName, teamLocation);
    if (!(teamName in obj)) {
        obj[teamName] = []
    };
    if (!obj[teamName].includes(teamLocation)) {
        res.send(fs.readFileSync(`challenges/${teamLocation}/${stringToHash(teamName, teamLocation)}.txt`));
    }
    else {
        res.send(`Bitte gebt einen neuen Standort ein`)
    }
});

app.post("/complete", (req, res) => {
    let { teamName, teamLocation } = req.body;
    console.log(teamName, teamLocation);
    if (!obj[teamName].includes(teamLocation)) {
        obj[teamName].push(teamLocation);
    }
    console.log(obj);
    res.send(`challenge for ${teamName} at ${teamLocation}`);
});

app.listen(PORT, () => {
    console.log(challenges)
    console.log(`listening on port ${PORT}`)
});

function stringToHash(string, teamLocation) {

    let hash = 0;

    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
        hash += string.charCodeAt(i);

    }

    hash = hash % fs.readdirSync(`challenges/${teamLocation}`).length;
    return hash;
}
