// URLS
var lampUrl = "http://192.168.1.41/";             // 0
var overTheShelfUrl = "http://192.168.1.59/";     // 1
var underTheShelfUrl = "http://192.168.1.42/";    // 2
var deskUrl = "http://192.168.1.33/";             // 3


function askAboutAllCurrentStates() {
    askAboutCurrentState(0);
    askAboutCurrentState(1);
    askAboutCurrentState(2);
    askAboutCurrentState(3);
}

// populate inputs with current state after load
askAboutAllCurrentStates();


// set interval for state refresh
window.setInterval(function () {
    askAboutAllCurrentStates();
}, 2000);

function sendSolidColorRequest(request, target = 0) {

    var xhr = new XMLHttpRequest();
    url = targetToUrl(target);

    // needs json/
    url += "json/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // var json = JSON.parse(xhr.responseText);
        }
    };
    var data = JSON.stringify(request);
    xhr.send(data);

}


function sendBrightnessRequest(desiredBrightness, target = 0) {

    url = targetToUrl(target);

    // needs win/
    url += "win/";
    url += "&A=" + desiredBrightness;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        // Request finished. Do processing here.
    };
    xhr.send(null);

}

function setSolidColor(target = 0, colorString) {


    colorArr = calculateRgbFromString(colorString);
    var request = {
        "seg": [
            { "col": [[colorArr[0], colorArr[1], colorArr[2]]] }
        ]
    }
    sendSolidColorRequest(request, target);
}

function setBrightness(target = 0, brightness) {
    sendBrightnessRequest(brightness, target);
}

function calculateRgbFromString(string) {

    r = string.slice(1, 3);
    r = parseInt(r, 16);
    g = string.slice(3, 5);
    g = parseInt(g, 16);
    b = string.slice(5, 7);
    b = parseInt(b, 16);

    return [r, g, b]
}


function calculateStringFromRgb(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length < 2) {
        r = "0" + r;
    }
    if (g.length < 2) {
        g = "0" + g;
    }
    if (b.length < 2) {
        b = "0" + b;
    }

    return "#" + r + g + b;
}


var previousBrightness = [];
var previousColor = [];

function askAboutCurrentState(target = 0) {

    // check if current target is locked or not
    var targetIsLocked = document.getElementById('brightness' + target).disabled;


    url = targetToUrl(target);
    // needs json/si
    url += "json/si";

    var xhr = new XMLHttpRequest();
    // add listener for error with request
    xhr.addEventListener('error', function () {
        // error with request happened, lock that target if it's not locked already
        if (!targetIsLocked) {
            lockTarget(target);
        }
    });

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // request went fine, got state
            var parsedJson = JSON.parse(xhr.response);

            // check for need to unlock, and unlock if needed
            if (targetIsLocked) {
                unlockTarget(target);
                // reset previous states so you are sure UI gets updated 
                previousBrightness[target] = null;
                previousColor[target] = null;
            }

            populateWithCurrentStateIfChanged(parsedJson, target);
        }
    }

    xhr.open('GET', url, true);
    xhr.onload = function () {
    };
    try {
        xhr.send(null);

    } catch (e) {
        console.log('Error during state request: ' + e);
    }

}

function populateWithCurrentStateIfChanged(currentState, target) {

    // perhaps there's need for an UI update, get brightness and hexString from state
    var brightness = currentState.state.bri;
    var colorRed = currentState.state.seg[0].col[0][0]
    var colorGreen = currentState.state.seg[0].col[0][1]
    var colorBlue = currentState.state.seg[0].col[0][2]
    var hexString = calculateStringFromRgb(colorRed, colorGreen, colorBlue);

    // check if there's need to update UI at all
    if (previousBrightness[target] == brightness && previousColor[target] == hexString) {
        // it's the same as before, no need to update UI
    } else {
        // it's different now, should update UI
        updateUI(brightness, hexString, target);
    }

    // save values from current state
    previousBrightness[target] = brightness;
    previousColor[target] = hexString;
}

function updateUI(brightness, hexString, target) {
    document.getElementById('brightness' + target).value = brightness;
    document.getElementById('solidColor' + target).value = hexString;
}

function targetToUrl(target) {
    switch (target) {
        case 0:
            url = lampUrl;
            break;
        case 1:
            url = overTheShelfUrl;
            break;
        case 2:
            url = underTheShelfUrl;
            break;
        case 3:
            url = deskUrl;
            break;
    }

    return url;
}


function lockTarget(target) {

    document.getElementById("name" + target).style.color = "gray";

    document.getElementById("solidColor" + target).disabled = true;
    document.getElementById("solidColor" + target).value = '#000000';

    document.getElementById("brightness" + target).disabled = true;
    document.getElementById("brightness" + target).value = 0;

    document.getElementById("status" + target).innerHTML = '<font color="red">&#x1F534;</font>';
}

function unlockTarget(target) {
    // console.log('unlocking target: ' + target);
    document.getElementById("name" + target).style.color = "black";
    document.getElementById("solidColor" + target).disabled = false;
    // document.getElementById("solidColor"+target).value = '#000000';
    document.getElementById("brightness" + target).disabled = false;
    // document.getElementById("brightness"+target).value = 0;
    document.getElementById("status" + target).innerHTML = '<font color="green">&#x1F7E2;</font>';

    // clean previous state so we are sure it's updated after connecting again


}




