#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266mDNS.h>
#include <ESP8266WebServer.h>
#include <FS.h> // Include the SPIFFS library
#include "configHandler.h"
#include "ArduinoJson.h"

ESP8266WiFiMulti wifiMulti; // Create an instance of the ESP8266WiFiMulti class, called 'wifiMulti'

ESP8266WebServer server(80); // Create a webserver object that listens for HTTP request on port 80

String getContentType(String filename); // convert the file extension to the MIME type
bool handleFileRead(String path);       // send the right file to the client (if it exists)

void handleSceneCreation()
{
  if (server.hasArg("plain") == false)
  { // Check if body received
    server.send(200, "text/plain", "Body not received when trying to /handleSceneCreation");
    return;
  }

  String message = "Got body on /handleSceneCreation:\n";
  message += server.arg("plain");
  message += "\n";
  server.send(200, "text/plain", message);
  Serial.println(message);

  // deserialize message
  DynamicJsonDocument newScene(maxJsonDocSizeForReading);
  deserializeJson(newScene, server.arg("plain"));

  // create json object that will hold current scene database
  DynamicJsonDocument currentDatabaseStatus(maxJsonDocSizeForAppending);
  // open file with current scene database
  File file = SPIFFS.open(sceneDatabaseFileName, "r");

  // read file into json object and close file
  deserializeJson(currentDatabaseStatus, file);
  file.close();

  if (currentDatabaseStatus.isNull())
  {
    // if file is empty, create new json object
    currentDatabaseStatus["scenes"] = JsonArray();
  }

  // append new scene to the database
  currentDatabaseStatus["scenes"].add(newScene);

  // write json to file, now richer by 1 element, and close file
  file = SPIFFS.open(sceneDatabaseFileName, "w");
  serializeJson(currentDatabaseStatus, file);
  file.close();
}

void setup()
{
  Serial.begin(115200); // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println('\n');

  wifiMulti.addAP("Orange_Swiatlowod_Gora", "mlekogrzybowe"); // add Wi-Fi networks you want to connect to
  // wifiMulti.addAP("Orange_Swiatlowod_E8A0", "mlekogrzybowe");

  Serial.println("Connecting ...");
  int i = 0;
  // DISABLED WAITING FOR CONNECTION
  while (wifiMulti.run() != WL_CONNECTED)
  { // Wait for the Wi-Fi to connect
    delay(250);
    Serial.print('.');
  }
  // END DISABLED WAITING FOR CONNECTION

  Serial.println('\n');
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID()); // Tell us what network we're connected to
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP()); // Send the IP address of the ESP8266 to the computer

  if (MDNS.begin("esp8266"))
  { // Start the mDNS responder for esp8266.local
    Serial.println("mDNS responder started");
  }
  else
  {
    Serial.println("Error setting up MDNS responder!");
  }

  SPIFFS.begin(); // Start the SPI Flash Files System

  // ######################## Web server handler function define START ########################

  server.onNotFound([]() {                              // If the client requests any URI
    if (!handleFileRead(server.uri()))                  // send it if it exists
      server.send(404, "text/plain", "404: Not Found"); // otherwise, respond with a 404 (Not Found) error
  });

  // handle POST data on /handleSceneCreation
  server.on("/handleSceneCreation", HTTP_POST, handleSceneCreation);

  // ######################## Web server handler function define END ########################

  server.enableCORS(true);
  server.begin(); // Actually start the server
  Serial.println("HTTP server started");

  // try to read existing scenes from database
  readExistingScenesFromDatabase();
}

void loop(void)
{
  server.handleClient();
}

String getContentType(String filename)
{ // convert the file extension to the MIME type
  if (filename.endsWith(".html"))
    return "text/html";
  else if (filename.endsWith(".css"))
    return "text/css";
  else if (filename.endsWith(".js"))
    return "application/javascript";
  else if (filename.endsWith(".ico"))
    return "image/x-icon";
  return "text/plain";
}

bool handleFileRead(String path)
{ // send the right file to the client (if it exists)
  Serial.println("handleFileRead: " + path);
  if (path.endsWith("/"))
    path += "index.html";                    // If a folder is requested, send the index file
  String contentType = getContentType(path); // Get the MIME type
  if (SPIFFS.exists(path))
  {                                                     // If the file exists
    File file = SPIFFS.open(path, "r");                 // Open it
    size_t sent = server.streamFile(file, contentType); // And send it to the client
    file.close();                                       // Then close the file again
    return true;
  }
  Serial.println("\tFile Not Found");
  return false; // If the file doesn't exist, return false
}