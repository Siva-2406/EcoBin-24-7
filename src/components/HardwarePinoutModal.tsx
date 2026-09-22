import React, { useState } from 'react';
import { X, Cpu, Copy, Check, Radio, Zap, AlertTriangle, ShieldCheck, Code } from 'lucide-react';

interface HardwarePinoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwarePinoutModal: React.FC<HardwarePinoutModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'wiring' | 'code'>('wiring');

  if (!isOpen) return null;

  const sampleArduinoCode = `/*
  EcoBin 24×7 - ESP8266 NodeMCU Firmware
  Hardware: ESP8266 NodeMCU v3 + HC-SR04 + LEDs + Active Buzzer
  No Blynk required - Direct REST API Telemetry to Backend
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://YOUR-APP-URL.run.app/api/sensor-data";

// Pin Configuration
#define TRIG_PIN D6    // HC-SR04 Trigger
#define ECHO_PIN D5    // HC-SR04 Echo (via 1k/2k voltage divider)
#define LED_GREEN D1   // Green LED (0-50% Normal)
#define LED_YELLOW D2  // Yellow LED (51-80% Medium)
#define LED_RED D7     // Red LED (81-100% Critical/Overflow)
#define BUZZER_PIN D0  // Active Piezo Buzzer

const float BIN_HEIGHT_CM = 30.0;
const char* DEVICE_ID = "ECOBIN-001";

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected. IP: " + WiFi.localIP().toString());
}

float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return BIN_HEIGHT_CM;
  return (duration * 0.0343) / 2.0;
}

void loop() {
  float distance = measureDistance();
  float wasteLevel = ((BIN_HEIGHT_CM - distance) / BIN_HEIGHT_CM) * 100.0;
  if (wasteLevel < 0) wasteLevel = 0;
  if (wasteLevel > 100) wasteLevel = 100;

  // Local LED & Buzzer indicators
  if (wasteLevel >= 96) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);
    digitalWrite(BUZZER_PIN, HIGH); // Alarm!
  } else if (wasteLevel >= 81) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);
    digitalWrite(BUZZER_PIN, LOW);
  } else if (wasteLevel >= 51) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  } else {
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  }

  // Send JSON telemetry to EcoBin 24×7 Backend API
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = String("{\\"deviceId\\":\\"") + DEVICE_ID +
                         "\\",\\"distance\\":" + String(distance, 1) +
                         ",\\"wasteLevel\\":" + String(int(wasteLevel)) + "}";

    int httpCode = http.POST(jsonPayload);
    Serial.printf("POST Response: %d\\n", httpCode);
    http.end();
  }

  delay(15000); // Send reading every 15 seconds
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleArduinoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="hardware-pinout-modal"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Hardware Wiring &amp; Circuit Reference
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              ESP8266 NodeMCU v3 + HC-SR04 + LEDs + Buzzer (College Project Specification)
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 mb-4">
          <button
            onClick={() => setActiveTab('wiring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'wiring'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pinout &amp; Wiring Table
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>ESP8266 Arduino C++ Firmware</span>
          </button>
        </div>

        {activeTab === 'wiring' ? (
          <div className="space-y-4">
            {/* Ultrasonic Sensor Wiring */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-600" />
                1. HC-SR04 Ultrasonic Sensor Connections
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-1.5 font-bold">HC-SR04 Pin</th>
                      <th className="pb-1.5 font-bold">ESP8266 Pin</th>
                      <th className="pb-1.5 font-bold">Description / Safety</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    <tr>
                      <td className="py-1.5 font-bold text-slate-900">VCC</td>
                      <td className="py-1.5 text-emerald-600 font-bold">VIN (5V)</td>
                      <td className="py-1.5 text-slate-500 font-sans">Power supply from USB/VIN</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold text-slate-900">GND</td>
                      <td className="py-1.5 text-slate-900">GND</td>
                      <td className="py-1.5 text-slate-500 font-sans">Common Ground</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold text-slate-900">TRIG</td>
                      <td className="py-1.5 text-blue-600 font-bold">D6 (GPIO12)</td>
                      <td className="py-1.5 text-slate-500 font-sans">Trigger output pulse (10µs)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold text-slate-900">ECHO</td>
                      <td className="py-1.5 text-amber-600 font-bold">D5 (GPIO14)</td>
                      <td className="py-1.5 text-slate-500 font-sans">
                        <span className="font-semibold text-rose-600">Safe Voltage Divider:</span> 1kΩ &amp; 2kΩ resistors to step down 5V echo to 3.3V safe logic for ESP8266!
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* LED Status Indicators */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                2. Status LEDs &amp; Audio Alarm
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-1.5 font-bold">Component</th>
                      <th className="pb-1.5 font-bold">ESP8266 Pin</th>
                      <th className="pb-1.5 font-bold">Resistor / Wiring</th>
                      <th className="pb-1.5 font-bold">Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    <tr>
                      <td className="py-1.5 font-bold text-emerald-600">Green LED</td>
                      <td className="py-1.5 font-bold">D1 (GPIO5)</td>
                      <td className="py-1.5 text-slate-500 font-sans">220Ω in series → GND</td>
                      <td className="py-1.5 text-slate-600 font-sans">0–50% (Normal)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold text-amber-600">Yellow LED</td>
                      <td className="py-1.5 font-bold">D2 (GPIO4)</td>
                      <td className="py-1.5 text-slate-500 font-sans">220Ω in series → GND</td>
                      <td className="py-1.5 text-slate-600 font-sans">51–80% (Medium)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold text-rose-600">Red LED</td>
                      <td className="py-1.5 font-bold">D7 (GPIO13)</td>
                      <td className="py-1.5 text-slate-500 font-sans">220Ω in series → GND</td>
                      <td className="py-1.5 text-slate-600 font-sans">81–100% (Critical / Overflow)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold text-purple-600">Active Buzzer</td>
                      <td className="py-1.5 font-bold">D0 (GPIO16)</td>
                      <td className="py-1.5 text-slate-500 font-sans">Positive (+) to D0, (-) to GND</td>
                      <td className="py-1.5 text-slate-600 font-sans">≥96% (Overflow Audio Siren)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Direct REST API Note */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Zero Dependency on Blynk:</strong>
                EcoBin 24×7 operates entirely on standard HTTP REST API endpoints. The NodeMCU directly sends JSON packets to <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">POST /api/sensor-data</code>, keeping the system enterprise-grade, secure, and vendor-neutral.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ready-to-flash Arduino IDE sketch (.ino)
              </span>
              <button
                onClick={copyCode}
                className="px-2.5 py-1 rounded bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied Code' : 'Copy Sketch'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[360px] leading-relaxed">
              <code>{sampleArduinoCode}</code>
            </pre>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
