#include "ArduinoJson.h"

void createConfigFile();
void readExistingScenesFromDatabase();
void printWholeArray(int *arrayPtr, int arraySize);
void handleSceneSwitch();

const int16_t maxTargets = 3;                               // amount of individual WLED modules
const int16_t maxSceneNameLength = 60;                      // longest possible scene name
const char sceneDatabaseFileName[] = "/sceneDatabase.json"; // name of the scene database file
const int16_t maxJsonDocSizeForAppending = 8192*2;            // max size of the json document with all scenes data
const int16_t maxJsonDocSizeForReading = 8192*2;              // max size of the json document when processing body of /handleSceneCreation

