# 🌾 Project Kisan: AI-Powered Assistant for Indian Farmers

## 🧠 Overview
**Project Kisan** is an AI-powered personal assistant built for small and marginal farmers in India. It empowers them with instant crop diagnosis, market intelligence, government scheme navigation, and personalized agri-advice — all through voice or text in their native language.

Built using Google Cloud's **Vertex AI**, **Gemini**, **Firebase**, and **Agri APIs**, this app aims to put an agronomist, market analyst, and policy expert right in the farmer's pocket.

---

## 🚀 Core Features

### 1. 🌿 Crop Disease Diagnosis (Gemini Vision)
- Farmers upload photos of diseased plants
- Gemini Vision identifies the issue (pest, fungal, bacterial)
- Suggests low-cost, local remedies

### 2. 📈 Real-Time Market Price & Trend Analysis
- Fetches mandi rates for user’s location
- Uses Gemini to analyze price trends and selling suggestions

### 3. 🏛️ Government Scheme Navigator
- Farmers can ask about irrigation subsidies, loans, etc.
- Gemini interprets government documents and simplifies response

### 4. 🗣️ Voice-First, Vernacular-First Interaction
- Supports Kannada and other Indian languages
- Voice input/output using Vertex AI STT and TTS

### 5. 🧪 Soil Health Detection from Image
- Upload a soil image
- Gemini Vision returns texture class, moisture level, and basic health status
- Helps plan fertilizer or irrigation needs

### 6. 📦 Smart Agri Calendar (Voice Interactive)
- Weekly crop-specific to-do lists based on stage and weather
- Gemini generates calendar reminders for irrigation, fertilizer, pest control

### 7. 📦 AI-Powered Inventory Tracker
- Farmers track stock of urea, pesticides, etc.
- Alerts on expiry, low stock, and usage patterns
- Supports QR scan and voice inputs

### 8. 🧭 Crop Insurance Claim Assistant (PMFBY)
- Guides farmers through crop damage claims
- Auto-generates pre-filled forms with geotagged photos
- Issues alerts during adverse weather conditions

### 9. 🎯 Personalized Crop Calendar
- Suggests optimal sowing, fertilizing, and harvesting timelines
- Based on weather, crop type, and land area
- Voice interactive and downloadable

### 10. 🏭 Input Fraud Checker
- Farmers scan input barcodes to verify authenticity
- Alerts if product is unregistered or banned

---

## 🔧 Tech Stack

| Area | Technology |
|------|------------|
| Frontend | Firebase Hosting + Firebase Studio |
| Backend | Firebase Functions + Firestore |
| AI Models | Vertex AI Gemini Pro + Gemini Vision |
| Voice Interface | Vertex AI Speech-to-Text, Text-to-Speech |
| Market & Scheme Data | AgMarknet API, Govt Agri Schemes, PMFBY APIs |
| Tools | GitHub, QR Scanner, PDF Generator, Google Maps, Weather API |

---

## 🧪 Setup Instructions
```bash
# Clone the repo
$ git clone https://github.com/your-org/project-kisan.git
$ cd project-kisan

# Setup Firebase
$ firebase login
$ firebase init
$ firebase deploy

# Add Gemini + Vertex AI API keys (environment config)
```

---

## 📸 Screenshots

---

## 🎁 Special Hackathon Features
- 🔥 Firebase Studio for deployment
- 💡 Gemini multimodal models
- 📢 Real farmer use case: Rohan from Karnataka

---

## 🤝 Contributing
We welcome contributions! Submit a pull request or open an issue.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
