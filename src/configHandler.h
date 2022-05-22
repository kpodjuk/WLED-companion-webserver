void createConfigFile();
void readExistingScenesFromDatabase();
void printWholeArray(int* arrayPtr, int arraySize);
void appendNewSceneIntoDatabase(String desiredSceneName, int32_t* desiredColorsPtr, int32_t* desiredBrightnessPtr);

const int16_t maxTargets = 3; // amount of individual WLED modules
const int16_t maxSceneNameLength = 40; // longest possible scene name
const char sceneDatabaseFileName[] = "/sceneDatabase.json"; // name of the scene database file
const int16_t maxJsonDocSizeForAppending = 8192; // max size of the json document

// 1 scene data structure, includes colors and bri of all strips + sceneName
typedef struct completeScene_t{

    char sceneName[maxSceneNameLength];
    int colorsList[maxTargets];
    int brightnessesList[maxTargets];

} completeScene_t;