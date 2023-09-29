import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import TeamTable from "./TeamTable.js";
import LocationManager from "./LocationManager.js";
import { PORT, PUBLIC_DIRECTORY, CHALLENGE_DIRECTORY, LOG_DIRECTORY } from "./constants.js";
import fetch from 'node-fetch';

const app = express();

app.use(express.static(PUBLIC_DIRECTORY));
app.use(express.json());
app.use(cors());

const teamTable = new TeamTable();
const locationManager = new LocationManager(CHALLENGE_DIRECTORY)

app.post("/load", (req, res) => {
    const [teamName, teamLocation] = getTeam(req);

    teamTable.addTeam(teamName);

    if (!locationManager.isLocationValid(teamLocation)) {
        res.send({ "error": "location does not exist" });
        return;
    }

    if (teamTable.isChallengeCompleted(teamName, teamLocation)) {
        res.send({ "error": "challenge already done" });
        return;
    }

    res.send(
        {
            "error": null,
            "text": locationManager.getChallenge(teamName, teamLocation)
        }
    );
});

app.post("/complete", (req, res) => {
    const [teamName, teamLocation] = getTeam(req);

    if (
        !locationManager.isLocationValid(teamLocation) ||
        teamTable.isChallengeCompleted(teamName, teamLocation)
    ) {
        res.sendStatus(400);
        return;
    }

    teamTable.completeChallenge(teamName, teamLocation)
    res.sendStatus(200);
});

app.get("/locations", (req, res) => {
    res.send(locationManager.getLocations());
});

app.get("/scores", (req, res) => {
    res.send(teamTable.getScores());
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

function getTeam(req) {
    const { teamName, teamLocation } = req.body;
    return [
        teamName.toLowerCase().trim(),
        teamLocation.toLowerCase().trim()
    ];
}

function saveTeamTable() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = now.getUTCDate().toString().padStart(2, '0');
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');

    const time = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    fs.writeFileSync(
        path.join(
            LOG_DIRECTORY,
            `log_${time}.json`
        ),
        JSON.stringify(teamTable, null, 4)
    );
}

process.on('SIGINT', () => {
    saveTeamTable();
    console.log("bye.")
    process.exit(0)
});

process.on('SIGQUIT', () => {
    saveTeamTable();
    console.log("bye.")
    process.exit(0)
});

process.on('SIGTERM', () => {
    saveTeamTable();
    console.log("bye.")
    process.exit(0)
});
