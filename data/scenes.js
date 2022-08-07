// ############################## SCENES CODE ##############################


// ############################## PARAMS ##############################
const maxTargets = 3; // amount of individual WLED modules


// read scene dropdown at the same beggining
readSceneDropDown();

function readSceneDropDown() {
    var choosenOption = document.getElementById('sceneDropdown').value;

    if (choosenOption == "createNewOne") {
        displaySceneCreationForm();
    } else if (choosenOption == "noneChoosen") {
        // nothing to do 
        hideSceneCreationForm();
    } else if (choosenOption == "loading") {
        // do nothing 
        hideSceneCreationForm();
    } else {
        // already existing scene was choosen, scenes have a value = sceneId
        hideSceneCreationForm();
        applyScene(choosenOption);
    }

}


function displaySceneCreationForm() {
    document.getElementById('sceneCreationForm').style.display = 'block';
}

function hideSceneCreationForm() {
    document.getElementById('sceneCreationForm').style.display = 'none';
}

function applyScene(sceneId) {
    let success = true;

    // send request with desired brightness and color to all targets
    var xhr = new XMLHttpRequest();
    for (let i = 0; i < maxTargets; i++) {
        xhr.open('GET', '/applyScene?sceneId=' + sceneId, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
            } else {
                success = false;
            }
        };

        xhr.send(null);

    }

    // check if all requests were successful, update status message accordignly
    if (success) {
        document.getElementById('sceneChangeStatus').innerHTML = "<font style='color:green'>Scene change request sent to all targets</font>";
    } else {
        document.getElementById('sceneChangeStatus').innerHTML = "<font style='color:red'>Error while changing scene!</font>";
    }

}


function submitSceneCreationForm() {

    var targetSettings = [];
    var scaneNameId = "scaneCreationSceneName";

    var scene = { // scene object to be filled with data
        "sceneName": document.getElementById(scaneNameId).value,
        "affectedTargets": [],
    };


    for (var target = 1; target <= maxTargets; target++) {
        // generate input ids
        var brightnessInputId = "sceneCreationFormBrightness" + target;
        var colorInputId = "sceneCreationFormColor" + target;
        var colorRGB = calculateRgbFromString(document.getElementById(colorInputId).value);


        var currentTarget = {
            "brightness": document.getElementById(brightnessInputId).value,
            "color": {
                "r": colorRGB[0],
                "g": colorRGB[1],
                "b": colorRGB[2],
            }
        }

        scene.affectedTargets.push(currentTarget);


    }

    createScene(scene);

}


function createScene(scene) {
    // Sending and receiving data in JSON format using POST method
    //
    var xhr = new XMLHttpRequest();
    var url = "http://192.168.1.52/handleSceneCreation";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('sceneCreationFormStatus').innerHTML = "<font style='color:green'>Success!</font>";
        } else {
            document.getElementById('sceneCreationFormStatus').innerHTML = "<font style='color:red'>Error!</font>";
        }
    };


    var data = JSON.stringify(scene);
    console.log(data)
    xhr.send(data);



}