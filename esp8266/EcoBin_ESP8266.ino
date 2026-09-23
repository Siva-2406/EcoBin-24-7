#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

const char* WIFI_SSID = "EcoTest";
const char* WIFI_PASSWORD = "EcoTest123";

const char* API_URL = "https://eco-bin-24-7.vercel.app/api/sensor-data";
const char* DEVICE_ID = "ECOBIN-001";

const int TRIG_PIN = D6;
const int ECHO_PIN = D5;
const int BUZZER_PIN = D0;

const float BIN_HEIGHT_CM = 20.0;
const float SENSOR_MIN_CM = 2.0;

unsigned long lastSend = 0;
const unsigned long SEND_INTERVAL_MS = 5000;

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(3);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1;

  return (duration * 0.0343) / 2.0;
}

String getStatus(float wasteLevel) {
  if (wasteLevel >= 90.0) return "OVERFLOW";
  if (wasteLevel >= 76.0) return "CRITICAL";
  if (wasteLevel >= 51.0) return "MEDIUM";
  return "NORMAL";
}

void updateBuzzer(float wasteLevel) {
  if (wasteLevel >= 90.0) {
    digitalWrite(BUZZER_PIN, HIGH);
  } else if (wasteLevel >= 76.0) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(150);
    digitalWrite(BUZZER_PIN, LOW);
    delay(150);
  } else if (wasteLevel >= 51.0) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(900);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }
}

void sendToServer(float distance, float wasteLevel, String status) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi disconnected. Skipping upload.");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  if (!https.begin(client, API_URL)) {
    Serial.println("HTTPS connection setup failed.");
    return;
  }

  https.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  payload += "\"distance\":" + String(distance, 1) + ",";
  payload += "\"wasteLevel\":" + String(wasteLevel, 1) + ",";
  payload += "\"status\":\"" + status + "\"";
  payload += "}";

  Serial.println("Sending:");
  Serial.println(payload);

  int httpCode = https.POST(payload);

  Serial.print("HTTP response: ");
  Serial.println(httpCode);

  String response = https.getString();
  Serial.println("Server response:");
  Serial.println(response);

  https.end();
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(500);

  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int count = 0;
  while (WiFi.status() != WL_CONNECTED && count < 40) {
    delay(500);
    Serial.print(".");
    count++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WIFI CONNECTED!");
    Serial.print("ESP8266 IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.print("Wi-Fi failed. Status: ");
    Serial.println(WiFi.status());
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println();
  Serial.println("================================");
  Serial.println("EcoBin 24x7 - Live IoT Gateway");
  Serial.println("================================");

  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    delay(1000);
    return;
  }

  if (millis() - lastSend >= SEND_INTERVAL_MS || lastSend == 0) {
    lastSend = millis();

    float distance = readDistanceCm();

    if (distance < 0) {
      Serial.println("HC-SR04: No valid echo.");
      digitalWrite(BUZZER_PIN, LOW);
      return;
    }

    if (distance > BIN_HEIGHT_CM) distance = BIN_HEIGHT_CM;
    if (distance < SENSOR_MIN_CM) distance = SENSOR_MIN_CM;

    float wasteLevel = ((BIN_HEIGHT_CM - distance) / (BIN_HEIGHT_CM - SENSOR_MIN_CM)) * 100.0;
    wasteLevel = constrain(wasteLevel, 0.0, 100.0);

    String status = getStatus(wasteLevel);

    Serial.println("--------------------------------");
    Serial.print("Distance: ");
    Serial.print(distance, 1);
    Serial.println(" cm");

    Serial.print("Waste Level: ");
    Serial.print(wasteLevel, 1);
    Serial.println("%");

    Serial.print("Status: ");
    Serial.println(status);

    sendToServer(distance, wasteLevel, status);
  }

  updateBuzzer(0); // keep buzzer quiet between uploads
  delay(50);
}
