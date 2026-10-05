# 🏆 Project JohAR — AR-Based Industrial Safety & Vocational Training Simulator
> **Smart India Hackathon (SIH) 2026** | **Problem Statement ID:** 26041 | **Target:** Government of Jharkhand & Industrial Workforce

---

## 📌 Overview
**Project JohAR** (*"Johar"* = Jharkhand Greeting + *"AR"* = Augmented Reality) is a production-grade, immersive AR vocational training, compliance, and certification platform tailored for Jharkhand's mining and heavy industrial workforce.

The platform addresses critical industrial safety challenges through interactive AR simulations, voice-first multilingual assistance, automated compliance tracking, and practical assessment protocols.

---

## 🌟 Key Features & Implemented Modules

### 1. 🔐 Onboarding & Profile Management (`0_Login.unity`)
- **Worker Verification**: Employee ID / Aadhaar / Phone number authentication with OTP flow.
- **Multilingual Support**: Instant switching between English, Hindi, and regional dialects (managed via `LanguageManager.cs`).
- **Modern Glassmorphic UI**: High-contrast, tactile UI optimized for industrial field workers.

### 2. 🏠 Worker Hub & Training Dashboard (`1_Home.unity`)
- **Safety Scorecard**: Real-time tracking of training modules completed, XP earned, and safety badges.
- **Module Directory**:
  - 🔥 Fire Safety & PASS Protocol (Active AR)
  - ⚡ Electrical Arc Flash & Safe Approach Distances
  - ☣️ Gas Leakage & Confined Space Safety
  - 🔒 Machinery Lockout / Tagout (LOTO)
  - ⛏️ Underground Mine Roof & Ground Support

### 3. 🧯 Immersive AR Fire Safety Simulator (`2_FireSafetyAR.unity`)
- **AR Foundation & Plane Tracking**: Places realistic 3D industrial fire hazards and virtual extinguisher in the user's physical environment.
- **PASS Protocol Interactive Simulation**:
  - **P** - Pull the Pin
  - **A** - Aim at the Base of the Fire
  - **S** - Squeeze the Extinguisher Lever
  - **S** - Sweep from Side to Side
- **Physics & VFX**: Realistic URP fire VFX, dynamic smoke plumes, flame extinguishing raycasting, and realistic particle interaction.
- **Real-Time Guidance & Feedback**: Dynamic step-by-step HUD instructions and audio-visual cues.

---

## 🛠️ Tech Stack & Dependencies

- **Game Engine**: Unity `6000.5.10f1` (Unity 6)
- **Render Pipeline**: Universal Render Pipeline (URP)
- **AR Framework**: Unity AR Foundation (`v6.0+`), ARCore XR Plugin, ARKit XR Plugin
- **Input & Interaction**: XR Interaction Toolkit, New Unity Input System
- **UI Framework**: Unity UGUI + TextMeshPro with responsive canvas anchors
- **Programming Language**: C# (.NET Standard 2.1)

---

## 📂 Repository Structure

```plaintext
SIH2026/
├── JohARApp/                              # Main Unity Project Directory
│   ├── Assets/                            # Source Assets, Scripts, Scenes, VFX, Prefabs
│   │   ├── Scenes/                        # 0_Login, 1_Home, 2_FireSafetyAR
│   │   ├── Scripts/                       # C# Core Logic
│   │   │   ├── AR/                        # AR Fire Manager, Extinguisher, VFX controller
│   │   │   ├── Data/                      # Language & Localization managers
│   │   │   ├── Editor/                    # Scene builders, UI modernizers, automation
│   │   │   └── UI/                        # Navigation, login, dashboard controllers
│   │   ├── Prefabs/                       # Fire extinguishers, realistic fire VFX, UI elements
│   │   ├── Textures/ & Materials/         # PBR textures and shaders
│   │   └── Vefects/                       # High-performance URP particle VFX
│   ├── Packages/                          # manifest.json & package lock files
│   └── ProjectSettings/                   # Unity Editor, XR, URP & Tag settings
├── FILES/                                 # Raw 3D models, Kenney UI packs, and media assets
├── JohAR Implementation Plan              # Comprehensive architectural specification document
├── .gitignore                             # Configured to ignore Library/, Logs/, builds, and temp files
└── README.md                              # Project documentation and setup guide
```

---

## 🚀 Getting Started for Teammates

### 1. Prerequisites
- **Unity Hub**: [Download Unity Hub](https://unity.com/download)
- **Unity Editor Version**: `6000.5.10f1`
  - Ensure the **Android Build Support** module (including OpenJDK, Android SDK & NDK tools) is installed.
- **Physical Device**: ARCore-supported Android device (or ARKit-supported iOS device) for testing AR camera features.

### 2. Opening the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/HalfPlateSahil/SIH2026.git
   cd SIH2026
   ```
2. Open **Unity Hub** -> Click **Add** -> **Add project from disk**.
3. Select the **`JohARApp`** folder (inside `SIH2026/`).
4. Select Unity Editor version `6000.5.10f1` and open.

### 3. Scene Order in Build Settings
Make sure scenes are added in the following order in `File > Build Profiles / Build Settings`:
1. `Assets/Scenes/0_Login.unity` (Index 0)
2. `Assets/Scenes/1_Home.unity` (Index 1)
3. `Assets/Scenes/2_FireSafetyAR.unity` (Index 2)

### 4. Building to Android
1. Go to **File > Build Settings...** (or Build Profiles).
2. Switch platform to **Android**.
3. Under **Edit > Project Settings > XR Plug-in Management**, ensure **Google ARCore** is checked for Android.
4. Connect your Android device with Developer Mode & USB Debugging enabled.
5. Click **Build and Run**.

---

## 🤝 Team Git Workflow & Guidelines

1. **Always pull before starting work**:
   ```bash
   git pull origin main
   ```
2. **Never delete `.meta` files**: In Unity, every asset has an associated `.meta` file containing its unique GUID. Always commit `.meta` files together with their corresponding assets.
3. **Keep branches clean**: Create feature branches for new development:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Commit messages**: Use descriptive commit messages:
   ```bash
   git commit -m "feat(ar): add realistic extinguisher pressure gauge animation"
   ```

---

## 👥 Team
- **Team**: HalfPlateSahil & Team
- **Hackathon**: Smart India Hackathon 2026
- **Repository**: [https://github.com/HalfPlateSahil/SIH2026](https://github.com/HalfPlateSahil/SIH2026)
