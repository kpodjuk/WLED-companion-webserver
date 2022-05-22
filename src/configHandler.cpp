#include <FS.h> // Include the SPIFFS library
#include "configHandler.h"
#include "ArduinoJson.h"
#include "string.h"
#include "stdio.h"

void appendNewSceneIntoDatabase(String desiredSceneName, int32_t *desiredColorsPtr, int32_t *desiredBrightnessPtr)
{

    Serial.println("Trying to get new scene appended to database!");

    // create json object for scene, variable could be a lot smaller
    DynamicJsonDocument doc(maxJsonDocSizeForAppending);

    File file = SPIFFS.open(sceneDatabaseFileName, "r");
    // Serial.print("current database file size: ");
    // Serial.println(file.size());

    // read file into json object and close file
    deserializeJson(doc, file);
    file.close();

    // create object that you are going to append to json object
    JsonObject obj = doc.createNestedObject();
    // add scene name
    obj["sceneName"] = desiredSceneName;
    // print scene name
    Serial.println("sceneName: " + desiredSceneName);


    // add all strip colors
    for (int i = 0; i < maxTargets; i++)
    {
        obj["colors"].add(desiredColorsPtr[i]);
        // print all strip colors
        Serial.print("colors[");
        Serial.print(i);
        Serial.print("]: ");
        Serial.println(desiredColorsPtr[i]);
    }

    // add all strip brightnesses
    for (int i = 0; i < maxTargets; i++)
    {
        obj["brightnesses"].add(desiredBrightnessPtr[i]);
                // print all strip brightnesses
        Serial.print("brightnesses[");
        Serial.print(i);
        Serial.print("]: ");
        Serial.println(desiredBrightnessPtr[i]);
    }

    // write json to file, now richer by 1 element, 
    file = SPIFFS.open(sceneDatabaseFileName, "w");
    serializeJson(doc, file);
    file.close();

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
    Serial.println("Number of scenes:");
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