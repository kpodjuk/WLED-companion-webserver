// get scene database from server


var url = '/sceneDatabase.json';
var storedText;
// fetch database
fetch(url)
    .then(function (response) {
        response.text().then(function (text) {
            storedText = text;
            done();
        });
    });

function done() {
    const sceneDatabase = JSON.parse(storedText);
    console.log(sceneDatabase);

    // hide "loading..." option
    document.getElementById('loading').style.display = 'none';
    // populate dropdown with existing scenes
    for (var i = 0; i < sceneDatabase.scenes.length; i++) {
        document.getElementById('sceneDropdown').innerHTML += "<option value=" + i + ">" + "&#9989;" + sceneDatabase.scenes[i].sceneName + "</option>"

    }
}