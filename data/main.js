


// document.getElementById('sendRequest').addEventListener("click", sendRequest)
// document.getElementById('solidColor0').addEventListener("input", setSolidColor(0));
// document.getElementById('solidColor1').addEventListener("input", setSolidColor(1));
// document.getElementById('solidColor2').addEventListener("input", setSolidColor(2));
// document.getElementById('solidColor3').addEventListener("input", setSolidColor(3));


// document.getElementById('niceColor').addEventListener("input", setNiceColor)
// document.getElementById('brightness').addEventListener("input", setBrightness)
function sendSolidColorRequest(request, target = 0) {

    // console.log("sendRequest():");

    // Sending and receiving data in JSON format using POST method
    //
    var xhr = new XMLHttpRequest();


    var lampUrl = "http://192.168.1.41/json/";             // 0
    var overTheShelfUrl = "http://192.168.1.59/json/";     // 1
    var underTheShelfUrl = "http://192.168.1.42/json/";    // 2
    var deskUrl = "http://192.168.1.33/json/";             // 3

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

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            // console.log(json.email + ", " + json.password);
            // console.log(json) // answer here
        }
    };
    // {"seg": [{"col":[[0,255,200]]}]
    var data = JSON.stringify(request);
    console.log(data);
    xhr.send(data);

}


function sendBrightnessRequest(desiredBrightness, target = 0) {

    var lampUrl = "http://192.168.1.41/win/";             // 0
    var overTheShelfUrl = "http://192.168.1.59/win/";     // 1
    var underTheShelfUrl = "http://192.168.1.42/win/";    // 2
    var deskUrl = "http://192.168.1.33/win/";             // 3

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

    switch (target) {
        case 0:
            var colorString = document.getElementById('solidColor0').value;

            break;
        case 1:
            var colorString = document.getElementById('solidColor1').value;
            break;
        case 2:
            var colorString = document.getElementById('solidColor2').value;
            break;
        case 3:
            var colorString = document.getElementById('solidColor3').value;
            break;
    }



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



function setBrightness(target = 0) {

    // console.log("target: " + target);
    switch (target) {
        case 0:
            var desiredBrightness = document.getElementById('brightness0').value;
            break;
        case 1:
            var desiredBrightness = document.getElementById('brightness1').value;
            break;
        case 2:
            var desiredBrightness = document.getElementById('brightness2').value;
            break;
        case 3:
            var desiredBrightness = document.getElementById('brightness3').value;
            break;
    }

    sendBrightnessRequest(desiredBrightness, target);


}