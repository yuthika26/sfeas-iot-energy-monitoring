# Smart Factory Energy Analytics & Optimization System (SFEAS)

An IoT-based energy monitoring system that tracks real-time power consumption and CO₂ emissions across factory machines, detects anomalies using ML, and visualizes insights on a live React.js dashboard.

## Tech Stack

- **Frontend:** React.js (7-tab dashboard)
- **Backend:** Node.js + Express
- **ML Service:** Python (Isolation Forest, Z-Score anomaly detection)
- **Database:** Firebase Realtime Database
- **IoT Simulation:** ESP32 (Wokwi), ACS712 current sensors, ZMPT101B voltage sensors
- **Protocol:** MQTT

## Features

- Real-time power consumption (kW) and CO₂ tracking across 17 machines
- Anomaly detection for machine faults and idle power wastage
- Peak demand prediction and ₹-based cost optimization recommendations
- 3-level alert system — Critical / Warning / Info
- Historical trend analysis via Firebase

## Run Locally

```bash
npm install
npm start
```

## Project Status
Simulated environment using Wokwi (ESP32). Full-stack system functional end-to-end.
