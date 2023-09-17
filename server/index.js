
import express from "express";
import TeamTable from "./TeamTable.js";
import LocationManager from "./LocationManager.js";
import { PORT, PUBLIC_DIRECTORY, CHALLENGE_DIRECTORY } from "./constants.js";

const app = express();

app.use(express.static(PUBLIC_DIRECTORY));
app.use(express.json());

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
