let teamName;
let teamLocation;
let challengeSetupDone;
let challengeFinishPopupToggle;
let challengeText;
let leaderboardTable;

window.onload = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }

    teamName = document.getElementById("team-name");
    teamLocation = document.getElementById("team-location");
    challengeSetupDone = document.getElementById("challenge-setup-done");
    challengeFinishPopupToggle = document.getElementById("challenge-finish-popup-toggle");
    challengeText = document.getElementById("challenge-text");
    leaderboardTable = document.getElementById("leaderboard-table");
}

document.addEventListener("keydown", event => {
    if (event.key == "Enter") {
        document.activeElement.click();
        document.activeElement.blur();
    }
});

async function submitSetup() {
    teamName.disabled = true;
    challengeSetupDone.checked = true;

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
        console.log(response.error);
        // TODO: handle error
        return;
    }

    challengeText.innerText = response.text;
    challengeFinishPopupToggle.disabled = false;
    challengeFinishPopupToggle.checked = false;
}

async function finishChallenge() {
    await fetch(
        "./complete",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "teamName": teamName.value,
                "teamLocation": teamLocation.value
            })
        }
    )
    challengeFinishPopupToggle.disabled = true;
    challengeFinishPopupToggle.checked = false;
    challengeSetupDone.checked = false;
}

function sortLeaderboard(table){
    let sorting = []
    for(let name of Object.keys(table)){
        sorting.push({
            "teamName": name,
            "score": table[name]
        })
    }
    sorting.sort((a, b) => b.score - a.score)
    return sorting
}  

async function renderLeaderboard() {

    leaderboardTable.innerHTML = ""
    let tableJSON = await (await fetch(
        "./scores",
        )).json()
    tableJSON = sortLeaderboard(tableJSON)
        
    for(let i = 0; i < tableJSON.length; i++){
        let listedname = document.createElement("span")
        listedname.innerText = tableJSON[i].teamName

        let listedscore = document.createElement("span")
        listedscore.innerText = tableJSON[i].score

        if(teamName.value.trim().toLowerCase() === tableJSON[i].teamName){
            listedname.style.backgroundColor = 'var(--theme-color-4)';
            listedscore.style.backgroundColor = 'var(--theme-color-4)';
        }

        leaderboardTable.appendChild(listedname)
        leaderboardTable.appendChild(listedscore)
    }

}
