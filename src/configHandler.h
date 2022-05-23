void createConfigFile();
void readExistingScenesFromDatabase();
void printWholeArray(int *arrayPtr, int arraySize);
void appendNewSceneIntoDatabase(String desiredSceneName, int32_t *desiredColorsPtr, int32_t *desiredBrightnessPtr);

const int16_t maxTargets = 3;                               // amount of individual WLED modules
const int16_t maxSceneNameLength = 60;                      // longest possible scene name
const char sceneDatabaseFileName[] = "/sceneDatabase.json"; // name of the scene database file
const int16_t maxJsonDocSizeForAppending = 8192;            // max size of the json document with all scenes data
const int16_t maxJsonDocSizeForReading = 200;              // max size of the json document when processing body of /handleSceneCreation
