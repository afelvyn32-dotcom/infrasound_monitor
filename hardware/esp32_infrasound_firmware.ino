/**
 * INFRASOUND MONITORING SYSTEM - ESP32 SENSOR NODE FIRMWARE
 * 
 * Hardware:
 * - ESP32 Development Board (ESP-WROOM-32)
 * - Bosch Sensortec BMP280 or BMP388 Barometric Pressure Sensor (I2C)
 * 
 * Wiring (I2C):
 * - ESP32 GPIO 21 -> Sensor SDA
 * - ESP32 GPIO 22 -> Sensor SCL
 * - ESP32 3V3     -> Sensor VCC
 * - ESP32 GND     -> Sensor GND
 * 
 * Features:
 * - High-speed 20 Hz barometric pressure sampling
 * - 10-sample local batching (transmits every 500ms)
 * - JSON serialization & HTTP POST to /api/v1/telemetry/submit
 * - Hardware API key authentication
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h> // Or Adafruit_BMP3XX if using BMP388

// =================== CONFIGURATION ===================
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend API URL (Replace with your server IP / domain)
const char* SERVER_URL    = "http://192.168.1.100:5000/api/v1/telemetry/submit";

// Sensor Credentials (Must match sensor registered in Admin Portal)
const char* SENSOR_ID     = "ESP32-INFRA-01";
const char* SENSOR_API_KEY= "sec_sensor_key_ridge_01";

// Sampling Parameters
const int SAMPLING_RATE_HZ = 20;               // 20 samples per second
const int SAMPLE_INTERVAL_MS = 1000 / SAMPLING_RATE_HZ; // 50ms
const int BATCH_SIZE = 10;                     // Send packet every 10 samples (500ms)
// =====================================================

Adafruit_BMP280 bmp; // I2C

struct Sample {
  unsigned long offsetMs;
  float pressureHPa;
};

Sample batchBuffer[BATCH_SIZE];
int sampleIndex = 0;
unsigned long batchStartTime = 0;
unsigned long lastSampleTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n[ESP32] Infrasound Node Initializing...");

  // 1. Initialize Sensor (I2C pins 21, 22)
  Wire.begin(21, 22);
  if (!bmp.begin(0x76) && !bmp.begin(0x77)) {
    Serial.println("[ESP32] Error: Could not find BMP280 sensor! Check wiring.");
    while (1) delay(100);
  }

  // Configure sensor oversampling for low-noise barometric variations
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling (high precision) */
                  Adafruit_BMP280::FILTER_X16,      /* IIR Filter */
                  Adafruit_BMP280::STANDBY_MS_1);   /* Standby time */

  // 2. Connect to Wi-Fi
  Serial.printf("[ESP32] Connecting to Wi-Fi: %s\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[ESP32] Wi-Fi Connected! IP: " + WiFi.localIP().toString());

  batchStartTime = millis();
}

void loop() {
  unsigned long now = millis();

  // Enforce 20 Hz sampling tick (every 50ms)
  if (now - lastSampleTime >= SAMPLE_INTERVAL_MS) {
    lastSampleTime = now;

    // Read barometric pressure (in hPa)
    float pressure = bmp.readPressure() / 100.0F;

    batchBuffer[sampleIndex].offsetMs = now - batchStartTime;
    batchBuffer[sampleIndex].pressureHPa = pressure;
    sampleIndex++;

    // When batch of 10 samples is ready (~500ms), transmit to server
    if (sampleIndex >= BATCH_SIZE) {
      sendTelemetryBatch();
      sampleIndex = 0;
      batchStartTime = millis();
    }
  }
}

void sendTelemetryBatch() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ESP32] Wi-Fi disconnected. Skipping packet.");
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-sensor-id", SENSOR_ID);
  http.addHeader("x-api-key", SENSOR_API_KEY);

  // Construct JSON Payload
  String json = "{";
  json += "\"sensorId\":\"" + String(SENSOR_ID) + "\",";
  json += "\"apiKey\":\"" + String(SENSOR_API_KEY) + "\",";
  json += "\"timestamp\":" + String(batchStartTime) + ",";
  json += "\"battery\":" + String(100) + ",";
  json += "\"rssi\":" + String(WiFi.RSSI()) + ",";
  json += "\"samples\":[";

  for (int i = 0; i < BATCH_SIZE; i++) {
    json += "{\"offsetMs\":" + String(batchBuffer[i].offsetMs) + ",";
    json += "\"rawPressure\":" + String(batchBuffer[i].pressureHPa, 2) + "}";
    if (i < BATCH_SIZE - 1) json += ",";
  }
  json += "]}";

  int httpResponseCode = http.POST(json);
  if (httpResponseCode > 0) {
    // Serial.printf("[ESP32] Ingestion OK (%d)\n", httpResponseCode);
  } else {
    Serial.printf("[ESP32] Error submitting telemetry: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}
