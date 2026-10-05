# 🎙️ JohAR Audio & Voiceover Directory Guide

All audio files in the application are organized in this central directory: `Assets/Audio/Voiceovers/` (and its mirrored runtime folder `Assets/Resources/Audio/Voiceovers/`).

---

## 📁 Directory Structure

Save your recorded audio files in the corresponding language folder:

```text
Assets/
└── Audio/
    └── Voiceovers/
        ├── English/
        │   ├── vo_step0_spawn_fire.mp3
        │   ├── vo_step1_remove_seal.mp3
        │   ├── vo_step2_pull_pin.mp3
        │   ├── vo_step3_aim_squeeze.mp3
        │   ├── vo_step4_spraying.mp3
        │   └── vo_step5_victory.mp3
        │
        ├── Hindi/
        │   ├── vo_step0_spawn_fire.mp3
        │   ├── vo_step1_remove_seal.mp3
        │   ├── vo_step2_pull_pin.mp3
        │   ├── vo_step3_aim_squeeze.mp3
        │   ├── vo_step4_spraying.mp3
        │   └── vo_step5_victory.mp3
        │
        └── Santali/
            ├── vo_step0_spawn_fire.mp3
            ├── vo_step1_remove_seal.mp3
            ├── vo_step2_pull_pin.mp3
            ├── vo_step3_aim_squeeze.mp3
            ├── vo_step4_spraying.mp3
            └── vo_step5_victory.mp3
```

> **Supported Formats:** `.mp3`, `.wav`, `.ogg`, `.m4a`

---

## 📜 Voiceover Transcriptions by Step & Language

### Step 0: Drill Start (Spawn Fire)
- **File Name:** `vo_step0_spawn_fire`
- **Trigger:** When AR simulation scene loads and camera plane detection is active.
- **English:** *"Tap on the floor to place the fire hazard and start the drill."*
- **Hindi (हिन्दी):** *"अभ्यास शुरू करने के लिए जमीन पर टैप करें और आग लगाएं।"*
- **Santali (ᱥᱟᱱᱛᱟᱲᱤ):** *"ᱦᱮᱣᱟ ᱮᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ ᱚᱛ ᱨᱮ ᱴᱮᱯ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱢᱮ᱾"*

---

### Step 1: Fire Spawned (P - Break Seal)
- **File Name:** `vo_step1_remove_seal`
- **Trigger:** When fire spawns and extinguisher appears in front of the camera.
- **English:** *"Fire hazard detected! Tap the yellow safety seal to break it."*
- **Hindi (हिन्दी):** *"आग का खतरा! पीले सुरक्षा सील पर टैप करके उसे तोड़ें।"*
- **Santali (ᱥᱟᱱᱛᱟᱲᱤ):** *"ᱥᱮᱸᱜᱮᱞ ᱵᱤᱯᱚᱫᱽ! ᱥᱟᱥᱟᱝ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱞ ᱴᱮᱯ ᱠᱟᱛᱮ ᱚᱪᱚᱜ ᱢᱮ᱾"*

---

### Step 2: Seal Removed (P - Pull Pin)
- **File Name:** `vo_step2_pull_pin`
- **Trigger:** When yellow safety seal breaks away.
- **English:** *"Good! Now slide or tap the metal safety pin to pull it out."*
- **Hindi (हिन्दी):** *"बहुत बढ़िया! अब मेटल सेफ्टी पिन को बाहर निकालने के लिए उस पर स्लाइड या टैप करें।"*
- **Santali (ᱥᱟᱱᱛᱟᱲᱤ):** *"ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱱᱤᱛᱚᱜ ᱢᱮᱬᱦᱮᱫ ᱯᱤᱱ ᱚᱰᱚᱠ ᱞᱟᱹᱜᱤᱫ ᱥᱞᱟᱭᱤᱰ ᱥᱮ ᱴᱮᱯ ᱢᱮ᱾"*

---

### Step 3: Pin Pulled (A & S - Aim & Squeeze Extinguisher)
- **File Name:** `vo_step3_aim_squeeze`
- **Trigger:** When the pin falls off and the extinguisher is ready to spray.
- **English:** *"Extinguisher is armed! Tap and hold the extinguisher, aim at the base of the fire, and move closer."*
- **Hindi (हिन्दी):** *"अग्निशामक तैयार है! Extinguisher को दबाकर रखें, आग की जड़ पर निशाना लगाएं और पास जाएं।"*
- **Santali (ᱥᱟᱱᱛᱟᱲᱤ):** *"Extinguisher ᱛᱮᱭᱟᱨ ᱮᱱᱟ! Extinguisher ᱞᱤᱱ ᱠᱟᱛᱮ ᱫᱚᱦᱚᱭ ᱢᱮ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱴᱷᱮᱱ ᱥᱮᱱᱚᱜ ᱢᱮ᱾"*

---

### Step 4: Actively Spraying (S - Sweep)
- **File Name:** `vo_step4_spraying`
- **Trigger:** When the user is actively spraying the fire.
- **English:** *"Spraying! Sweep side to side across the base until the fire is completely extinguished."*
- **Hindi (हिन्दी):** *"स्प्रे जारी रखें! आग के निचले हिस्से पर दोनों तरफ घुमाएं जब तक आग पूरी तरह बुझ न जाए।"*
- **Santali (ᱥᱟᱱᱛᱟᱲᱤ):** *"ᱥᱯᱨᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ! ᱥᱮᱸᱜᱮᱞ ᱯᱩᱨᱟᱹ ᱤᱬᱤᱡᱚᱜ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱟᱛᱟᱨ ᱨᱮ ᱟᱹᱪᱩᱨ ᱢᱮ᱾"*

---

### Step 5: Drill Complete (Victory Debrief)
- **File Name:** `vo_step5_victory`
- **Trigger:** When fire health reaches 0% and victory debrief modal appears.
- **English:** *"Great job! The fire is completely extinguished. P.A.S.S. protocol completed safely."*
- **Hindi (हिन्दी):** *"शाबाश! आग पूरी तरह बुझ गई है। P.A.S.S. सुरक्षा ड्रिल सफलता से पूरी हुई।"*
- **Santali (ᱥᱟᱱᱛᱟᱲᱤ):** *"ᱟᱹᱰᱤ ᱵᱷᱟᱹᱜᱤ! ᱥᱮᱸᱜᱮᱞ ᱯᱩᱨᱟᱹ ᱤᱬᱤᱡ ᱮᱱᱟ᱾ P.A.S.S. ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱮᱣᱟ ᱥᱟᱹᱛ ᱮᱱᱟ᱾"*

---

## ⚡ How It Plays In-Game
- The `DrillVoiceoverManager` component automatically detects the language selected on the Login/Home screen.
- When an audio file with the matching name is placed in `Assets/Resources/Audio/Voiceovers/<Language>/` or `Assets/Audio/Voiceovers/<Language>/`, it will automatically play at that exact step!
