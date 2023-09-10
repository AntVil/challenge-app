let challengeSetupDone;
let challengeFinishPopupToggle;
let challengeText;

window.onload = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }

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

async function submitSetup(){
    challengeSetupDone.checked = true;

    loadChallenge();
}

async function loadChallenge(){
    let { locationId, text } = await (await fetch("./challenge")).json();
    
    challengeText.innerText = text;
    challengeFinishPopupToggle.disabled = false;
    challengeFinishPopupToggle.checked = false;
}

async function finishChallenge(){
    challengeFinishPopupToggle.disabled = true;
    loadChallenge();
}
