let teamName;
let teamLocation;
let challengeSetupDone;
let challengeFinishPopupToggle;
let challengeText;

window.onload = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }

    teamName = document.getElementById("team-name");
    teamLocation = document.getElementById("team-location");
    challengeSetupDone = document.getElementById("challenge-setup-done");
    challengeFinishPopupToggle = document.getElementById("challenge-finish-popup-toggle");
    challengeText = document.getElementById("challenge-text");
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

    const text = await (await fetch(
        "./load",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "teamName": teamName.value,
                "teamLocation": teamLocation.value
            })
        }
    )).text();

    challengeText.innerText = text;
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
