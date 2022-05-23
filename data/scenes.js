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
    } else {
        // already existing scene was choosen, scenes have a value = sceneId
        hideSceneCreationForm();
        applyScene(sceneId);
    }

}


function displaySceneCreationForm() {
    document.getElementById('sceneCreationForm').style.display = 'block';
}

function hideSceneCreationForm() {
    document.getElementById('sceneCreationForm').style.display = 'none';
}

function applyScene(sceneId) {
    console.log('scene is choosen with id: ' + sceneId);
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
        }
    };


    var data = JSON.stringify(scene);
    console.log(data)
    xhr.send(data);

}