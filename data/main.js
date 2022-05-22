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
            var json = JSON.parse(xhr.responseText);
        }
    };
    var data = JSON.stringify(request);
    console.log(data);
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
        // console.log("Brightness request finished");
    };
    xhr.send(null);

}

function setSolidColor(target = 0) {
    var colorString = document.getElementById('solidColor' + target).value;

    console.log('solidColor' + target);
    console.log('colorString' + colorString);

    colorArr = calculateRgbFromString(colorString);
    var request = {
        "seg": [
            { "col": [[colorArr[0], colorArr[1], colorArr[2]]] }
        ]
    }
    sendSolidColorRequest(request, target);
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



function setBrightness(target = 0) {

    var desiredBrightness = document.getElementById('brightness' + target).value;
    sendBrightnessRequest(desiredBrightness, target);
}


function askAboutCurrentState(target = 0) {

    url = targetToUrl(target);

    // needs json/si
    url += "json/si";

    var xhr = new XMLHttpRequest();
    // add listener for error with request
    xhr.addEventListener('error', function () {
        document.getElementById("status" + target).innerHTML = '<font color="red">Disconnected</font>';
    });

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var parsedJson = JSON.parse(xhr.response)
            document.getElementById("status" + target).innerHTML = '<font color="green">Connected</font>';

            populateWithCurrentState(parsedJson, target);
        }
    }

    xhr.open('GET', url, true);
    xhr.onload = function () {
    };
    xhr.send(null);

}

function populateWithCurrentState(parsedJson, target) {
    var brightness = parsedJson.state.bri;

    var colorRed = parsedJson.state.seg[0].col[0][0]
    var colorGreen = parsedJson.state.seg[0].col[0][1]
    var colorBlue = parsedJson.state.seg[0].col[0][2]

    var hexString = calculateStringFromRgb(colorRed, colorGreen, colorBlue);

    // console.log("## ## ## STATE UPDATE ## ## ##");
    // console.log("target:" + target);
    // console.log("brightness:" + brightness);
    // console.log("hexString:" + hexString);

    // update UI
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