// ############################## SCENES CODE ##############################


// ############################## PARAMS ##############################
const maxTargets = 3; // amount of individual WLED modules


// read scene dropdown at the same beggining
readSceneDropDown();

function readSceneDropDown() {
    var choosenOption = document.getElementById('sceneDropdown').value;

    if (choosenOption == "createNewOne") {
        displaySceneCreationForm();
    } else {
        // already existing scene was choosen, scenes have a value starting with "scene_IDGOESHERE"
        hideSceneCreationForm();
        var sceneId = choosenOption.substring(6);
        applyScene(sceneId);
    }

}


function displaySceneCreationForm() {
    document.getElementById('sceneCreationForm').style.display = 'block';
}

function hideSceneCreationForm() {
    console.log('hiding scene creation form');
    document.getElementById('sceneCreationForm').style.display = 'none';

}

function applyScene(sceneId) {
    console.log('scene is choosen with id: ' + sceneId);

}


function submitSceneCreationForm() {

    var targetSettings = [];

    var scaneNameId = "scaneCreationSceneName";


    // populate targetSettings array
    for (var target = 1; target <= maxTargets; target++) {
        // generate input ids
        var brightnessInputId = "sceneCreationFormBrightness" + target;
        var colorInputId = "sceneCreationFormColor" + target;

        // push current target properties to array
        targetSettings.push({
            color: document.getElementById(colorInputId).value,
            brightness: document.getElementById(brightnessInputId).value,
        });

    }
    // push scene name as a last element of array after all targets(led strips)
    targetSettings.push({ sceneName: document.getElementById(scaneNameId).value });
    createScene(targetSettings);

}


function createScene(targetSettings) {
    // send scene settings to server to save in a config
    console.log(targetSettings);
}