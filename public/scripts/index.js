let teamName;
let teamLocation;

let setupScreen;
let mainScreen;
let leaderboardScreen;

let challengeFinishPopupToggle;

let challengeText;
let leaderboardTable;

window.onload = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }

    teamName = document.getElementById("team-name");
    teamLocation = document.getElementById("team-location");

    setupScreen = document.getElementById("setup-screen");
    mainScreen = document.getElementById("main-screen");
    leaderboardScreen = document.getElementById("leaderboard-screen");

    challengeFinishPopupToggle = document.getElementById("challenge-finish-popup-toggle");

    challengeText = document.getElementById("challenge-text");
    leaderboardTable = document.getElementById("leaderboard-table");

    setupLocationOptions();
}

document.addEventListener("keydown", event => {
    if (event.key == "Enter") {
        document.activeElement.click();
        document.activeElement.blur();
    }
});

function getLocation() {
    return teamLocation.value.trim().toLowerCase();
}

function getName() {
    return teamName.value.trim().toLowerCase();
}

async function setupLocationOptions(){
    let locations = await (await fetch("/locations")).json();

    for (let location of locations) {
        let option = document.createElement("option");
        option.innerText = location.toUpperCase();
        option.value = location;
        teamLocation.appendChild(option);
    }
}

async function submitSetup() {
    teamName.disabled = true;
    mainScreen.checked = true;

    const response = await (await fetch(
        "./load",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "teamName": teamName.value,
                "teamLocation": teamLocation.value
            })
        }
    )).json();

    if (response.error) {
        challengeText.innerText = "Challenge bereits abgeschlossen";
        challengeFinishPopupToggle.disabled = true;
    }else{
        challengeText.innerText = response.text;
        challengeFinishPopupToggle.disabled = false;
    }
}

async function finishChallenge() {
    await fetch(
        "./complete",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "teamName": getName(),
                "teamLocation": getLocation()
            })
        }
    );
    challengeFinishPopupToggle.disabled = true;
    challengeFinishPopupToggle.checked = false;
    setupScreen.checked = true;
}

async function getLeaderboard() {
    let table = await (await fetch("./scores")).json();

    let list = []
    for (let name of Object.keys(table)) {
        list.push({
            "teamName": name,
            "score": table[name]
        });
    }

    return list.sort((a, b) => b.score - a.score);
}

async function renderLeaderboard() {
    let leaderBoard = await getLeaderboard();
    let name = getName();

    leaderboardTable.innerHTML = "";
    for (let i = 0; i < leaderBoard.length; i++) {
        let entry = document.createElement("li");
        let entryName = document.createElement("span");
        let entryScore = document.createElement("span");
        entryName.innerText = leaderBoard[i].teamName;
        entryScore.innerText = leaderBoard[i].score;

        if (leaderBoard[i].teamName === name) {
            entry.style.backgroundColor = "var(--theme-color-4)";
        }

        entry.appendChild(entryName);
        entry.appendChild(entryScore);
        leaderboardTable.appendChild(entry);
    }
}
