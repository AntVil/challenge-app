export default class CompletedChallenge {
    constructor(locationName) {
        this.locationName = locationName;
        this.timestamp = (new Date()).getTime();
    }

    getPoints() {
        return parseInt(this.locationName.slice(1));
    }
}
