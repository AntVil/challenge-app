import TeamTableEntry from "./TeamTableEntry.js";

export default class TeamTable {
    constructor() {
        this.table = {};
    }

    addTeam(teamName) {
        if (!(teamName in this.table)) {
            this.table[teamName] = new TeamTableEntry();
        }
    }

    getTeamNames() {
        return Object.keys(this.table);
    }

    completeChallenge(teamName, teamLocation) {
        this.table[teamName].completeChallenge(teamLocation);
    }

    isChallengeCompleted(teamName, teamLocation) {
        return this.table[teamName].isChallengeCompleted(teamLocation);
    }

    getScore(teamName) {
        return this.table[teamName].getScore();
    }

    getScores() {
        let scores = {};
        for (const teamName of this.getTeamNames()) {
            scores[teamName] = this.getScore(teamName)
        }
        return scores;
    }
}
