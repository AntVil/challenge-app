import fs from "fs";
import path from "path";

export default class LocationManager {
    constructor(challengeDirectory) {
        this.challengeDirectory = challengeDirectory;
        this.locations = fs.readdirSync(challengeDirectory).sort();
    }

    isLocationValid(location) {
        return this.locations.includes(location);
    }

    getChallenge(teamName, teamLocation) {
        const string = teamName + teamLocation;
        let hash = 0;

        for (let i = 0; i < string.length; i++) {
            hash += string.charCodeAt(i);
        }

        const locationDirectory = path.join(this.challengeDirectory, teamLocation)

        hash = hash % fs.readdirSync(locationDirectory).length;

        return fs.readFileSync(path.join(locationDirectory, `${hash}.txt`), { encoding: "utf-8" });
    }

    getLocations() {
        return this.locations;
    }
}
