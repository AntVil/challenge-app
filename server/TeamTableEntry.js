import CompletedChallenge from "./CompletedChallenge.js";

export default class TeamTableEntry {
    constructor() {
        this.completedChallenges = [];
    }

    completeChallenge(teamLocation) {
        this.completedChallenges.push(new CompletedChallenge(teamLocation));
    }

    isChallengeCompleted(teamLocation) {
        for (const completedChallenge of this.completedChallenges) {
            if (completedChallenge.locationName === teamLocation) {
                return true;
            }
        }
        return false;
    }

    getScore() {
        let score = 0;
        for (const completedChallenge of this.completedChallenges) {
            score += completedChallenge.getPoints();
        }
        return score;
    }
}
