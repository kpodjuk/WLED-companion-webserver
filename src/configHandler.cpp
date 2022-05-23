#include <FS.h> // Include the SPIFFS library
#include "configHandler.h"
#include "ArduinoJson.h"
#include "string.h"
#include "stdio.h"

void appendNewSceneIntoDatabase(const DynamicJsonDocument& sceneObject)
{


}

void readExistingScenesFromDatabase()
{
    Serial.println("Trying to readExistingScenesFromDatabase()...");

    // create json object into which you are going to read the file
    DynamicJsonDocument doc(maxJsonDocSizeForAppending);
    // open file
    File file = SPIFFS.open(sceneDatabaseFileName, "r");
    // read file into json object and close file
    deserializeJson(doc, file);
    file.close();

    // print total number of scenes
    Serial.print("Number of loaded scenes: ");
    Serial.println(doc.size());

    // make sure you can read properties
    // String firstSceneName = doc[0]["sceneName"];
    // Serial.print("firstSceneName: ");
    // Serial.print(firstSceneName);
}

// ####### HELPER FUNCTIONS #######
void printWholeArray(int *arrayPtr, int arraySize)
{
    for (int i = 0; i < arraySize; i++)
    {
        Serial.print(arrayPtr[i]);
        Serial.print(", ");
    }
    Serial.println();
}