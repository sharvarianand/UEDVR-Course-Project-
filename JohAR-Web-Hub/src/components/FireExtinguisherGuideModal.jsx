import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Volume2, 
  Sparkles, 
  Layers, 
  Play, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Check, 
  Target, 
  DoorOpen, 
  RotateCcw,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function FireExtinguisherGuideModal({ 
  worker, 
  language = 'English', 
  onClose, 
  onStartAR 
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Anatomy, 2: Seal, 3: Pin, 4: Ready/PASS
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [isPinPulled, setIsPinPulled] = useState(false);
  const [pinFrame, setPinFrame] = useState(0); // 0 to 6 image frame sequence
  const [isPullingAnimation, setIsPullingAnimation] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);

  const dragStartXRef = useRef(null);
  const currentFrameRef = useRef(0);
  currentFrameRef.current = pinFrame;

  // Preload all high-res frame assets immediately to ensure zero-lag animation
  useEffect(() => {
    const frameUrls = [
      './module_images/extinguisher_seal_intact.jpg',
      './module_images/extinguisher_seal_broken.jpg',
      './module_images/extinguisher_pin_removed.jpg',
      './module_images/pin_frame_0.jpg',
      './module_images/pin_frame_1.jpg',
      './module_images/pin_frame_2.jpg',
      './module_images/pin_frame_3.jpg',
      './module_images/pin_frame_4.jpg',
      './module_images/pin_frame_5.jpg',
      './module_images/pin_frame_6.jpg',
    ];
    frameUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const triggerHaptic = (ms = 30) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  // Translations
  const TEXTS = {
    English: {
      modalBadge: 'DGMS AR PRE-BRIEFING',
      title: 'Fire Extinguisher Protocol',
      subtitle: 'Master equipment operation before entering the live AR simulation',
      stepIndicator: 'Step',
      of: 'of',
      next: 'Next Step',
      prev: 'Previous',
      startAR: 'START AR SIMULATION',
      brokenSealSuccess: 'Seal Broken Successfully!',
      pulledPinSuccess: 'Safety Pin Pulled Successfully!',
      tapToBreak: 'TAP TO BREAK SEAL',
      slidePullPin: 'TAP OR SWIPE PIN TO EXTRACT',
      pullingPin: 'EXTRACTING SAFETY PIN...',
      replayPull: 'REPLAY PIN EXTRACTION',
      steps: {
        step1: {
          title: 'Extinguisher Anatomy & Readiness',
          desc: 'Before tackling any underground coal face or electrical fire, verify equipment integrity. Ensure the pressure gauge needle is in the GREEN operating zone (12–15 bar) and the discharge horn is unobstructed.',
          hotspotInstruction: 'Tap on the highlighted parts to inspect key components:',
          hotspots: [
            { id: 'gauge', title: 'Pressure Gauge', desc: 'Indicates internal nitrogen propellant pressure. Needle MUST sit firmly in the green zone (14 bar).' },
            { id: 'lever', title: 'Operating Lever & Carry Handle', desc: 'Lower handle carries unit; upper squeeze lever opens the discharge valve once pin is pulled.' },
            { id: 'seal_pin', title: 'Tamper Seal & Safety Pin', desc: 'Prevents accidental squeeze during transit. Must be released in sequence before use.' },
            { id: 'hose', title: 'High-Pressure Discharge Hose & Horn', desc: 'Reinforced rubber hose with insulated horn nozzle to prevent cryogenic cold burns during CO2/Dry Chem discharge.' },
            { id: 'body', title: 'Heavy-Gauge Steel Cylinder', desc: 'Contains 6kg ABC dry chemical powder (Monoammonium Phosphate) pressurized to extinguish coal and electrical fires.' }
          ]
        },
        step2: {
          title: 'Step 1: Break the Tamper Seal',
          desc: 'The yellow plastic tamper seal locks the metal pin firmly in place, confirming the extinguisher has not been discharged or compromised. You must twist and snap this seal prior to pulling the pin.',
          actionHint: 'Touch the yellow seal below to twist and break it:',
          sealStatusLocked: 'Tamper Seal: INTACT (Locked)',
          sealStatusUnlocked: 'Tamper Seal: BROKEN (Ready)',
          explanation: 'Rule of Mine Safety: Never force the metal pin while the plastic seal is intact, as the seal wire may jam the valve neck. Always twist the seal ring to snap the plastic thread.'
        },
        step3: {
          title: 'Step 2: Pull the Safety Pin',
          desc: 'With the tamper seal detached, firmly pull the ring safety pin straight out from the valve head. This disengages the mechanical stop and unlocks the squeeze lever.',
          actionHint: 'Touch the silver ring pin below to extract it:',
          pinStatusLocked: 'Safety Pin: ENGAGED (Lever Locked)',
          pinStatusUnlocked: 'Safety Pin: EXTRACTED (Lever Unlocked)',
          explanation: 'Caution: Hold the extinguisher firmly by the LOWER carry handle. Do NOT squeeze the upper lever while pulling the pin, otherwise the pin will pinch and resist removal.'
        },
        step4: {
          title: 'Step 3: P.A.S.S. Protocol & AR Mission',
          desc: 'You are now certified in extinguisher mechanical readiness! Review the DGMS P.A.S.S. protocol before commencing your AR drill.',
          passSummary: [
            { letter: 'P', title: 'PULL THE PIN', desc: 'Disengage the lock pin with a firm, steady pull.' },
            { letter: 'A', title: 'AIM AT BASE', desc: 'Point nozzle at the base of the fire, NOT the high flames.' },
            { letter: 'S', title: 'SQUEEZE LEVER', desc: 'Depress the upper trigger lever evenly to release agent.' },
            { letter: 'S', title: 'SWEEP SIDE-TO-SIDE', desc: 'Sweep 15cm past both fire edges until completely out.' }
          ],
          missionFlowTitle: 'YOUR AR SIMULATION OBJECTIVES:',
          missionFlow: [
            '1. Scan your room or floor using your camera.',
            '2. Tap "Start Simulation" once ground plane is recognized.',
            '3. An emergency fire will ignite. Choose the correct 3D equipment from the 3 options (Water vs Extinguisher vs Wet Cloth).',
            '4. Execute PASS to extinguish the fire.',
            '5. Look around to find the illuminated EMERGENCY FIRE EXIT and tap it to evacuate!'
          ]
        }
      }
    },
    Hindi: {
      modalBadge: 'DGMS AR प्रारंभिक प्रशिक्षण',
      title: 'अग्निशामक यंत्र संचालन प्रोटोकॉल',
      subtitle: 'लाइव AR सिमुलेशन में प्रवेश करने से पहले उपकरण संचालन सीखें',
      stepIndicator: 'चरण',
      of: 'का',
      next: 'अगला चरण',
      prev: 'पिछला',
      startAR: 'AR सिमुलेशन शुरू करें',
      brokenSealSuccess: 'सील सफलतापूर्वक तोड़ दी गई!',
      pulledPinSuccess: 'सुरक्षा पिन सफलतापूर्वक निकाल ली गई!',
      tapToBreak: 'सील तोड़ने के लिए टैप करें',
      slidePullPin: 'पिन निकालने के लिए टैप या बाईं ओर खींचें',
      pullingPin: 'पिन निकाली जा रही है...',
      replayPull: 'पिन एनीमेशन दोबारा देखें',
      steps: {
        step1: {
          title: 'अग्निशामक यंत्र की संरचना एवं जांच',
          desc: 'कोयला खदान या बिजली की आग से निपटने से पहले उपकरण की जांच करें। सुनिश्चित करें कि प्रेशर गेज की सुई हरे क्षेत्र (14 bar) में है और डिस्चार्ज पाइप साफ है।',
          hotspotInstruction: 'मुख्य भागों को देखने के लिए नीचे टैप करें:',
          hotspots: [
            { id: 'gauge', title: 'प्रेशर गेज (दाबमापी)', desc: 'आंतरिक नाइट्रोजन दबाव दिखाता है। सुई हमेशा हरे सुरक्षित क्षेत्र में होनी चाहिए।' },
            { id: 'lever', title: 'ऑपरेटिंग लीवर और हैंडल', desc: 'निचला हैंडल उठाने के लिए है, ऊपरी लीवर पिन निकालने के बाद आग बुझाने का पाउडर छोड़ता है।' },
            { id: 'seal_pin', title: 'सील एवं सुरक्षा पिन', desc: 'अचानक दबने से रोकता है। उपयोग से पहले इन्हें क्रम से हटाना अनिवार्य है।' },
            { id: 'hose', title: 'डिस्चार्ज होज़ व नोजल', desc: 'मजबूत रबर होज़ जो पाउडर को सटीक रूप से आग की जड़ तक पहुंचाता है।' },
            { id: 'body', title: 'मजबूत स्टील सिलेंडर', desc: 'इसमें 6 किलोग्राम ABC ड्राई केमिकल पाउडर होता है जो बिजली और कोयला आग को बुझाता है।' }
          ]
        },
        step2: {
          title: 'चरण 1: पीली सील को तोड़ें',
          desc: 'पीली प्लास्टिक सील पिन को सुरक्षित रखती है और दर्शाती है कि उपकरण का पहले उपयोग नहीं हुआ है। पिन खींचने से पहले इस सील को घुमाकर तोड़ना आवश्यक है।',
          actionHint: 'सील को मोड़ने और तोड़ने के लिए नीचे टैप करें:',
          sealStatusLocked: 'टैम्पर सील: सुरक्षित (लॉक)',
          sealStatusUnlocked: 'टैम्पर सील: टूट गई (तैयार)',
          explanation: 'खदान सुरक्षा नियम: सील तोड़े बिना कभी पिन को ज़बरदस्ती न खींचें, इससे वाल्व जाम हो सकता है।'
        },
        step3: {
          title: 'चरण 2: सुरक्षा पिन को बाहर खींचें',
          desc: 'सील टूटने के बाद, रिंग वाली सुरक्षा पिन को सीधा बाहर खींचें। यह लीवर को अनलॉक करता है जिससे बुझाने वाला रसायन निकल सके।',
          actionHint: 'सिल्वर पिन को बाहर निकालने के लिए टैप करें:',
          pinStatusLocked: 'सुरक्षा पिन: लगी हुई (लीवर लॉक)',
          pinStatusUnlocked: 'सुरक्षा पिन: निकल गई (लीवर अनलॉक)',
          explanation: 'सावधानी: अग्निशामक को केवल नीचे वाले हैंडल से पकड़ें। पिन खींचते समय ऊपर वाले लीवर को न दबाएं।'
        },
        step4: {
          title: 'चरण 3: P.A.S.S. तकनीक एवं AR मिशन',
          desc: 'अब आप उपकरण संचालन के लिए तैयार हैं! AR ड्रिल शुरू करने से पहले DGMS P.A.S.S. नियम याद रखें।',
          passSummary: [
            { letter: 'P', title: 'PULL (पिन खींचें)', desc: 'सुरक्षा पिन को मजबूती से बाहर खींचें।' },
            { letter: 'A', title: 'AIM (निशाना लगाएं)', desc: 'नोजल को आग की लपटों पर नहीं, बल्कि आग की जड़ (Base) पर रखें।' },
            { letter: 'S', title: 'SQUEEZE (दबाएं)', desc: 'पाउडर छोड़ने के लिए लीवर को दबाएं।' },
            { letter: 'S', title: 'SWEEP (घुमाएं)', desc: 'आग के दोनों किनारों पर बाएं से दाएं झाड़ू की तरह घुमाएं।' }
          ],
          missionFlowTitle: 'आपके AR सिमुलेशन चरण:',
          missionFlow: [
            '1. कैमरे से फर्श और कमरे को स्कैन करें।',
            '2. फर्श मिलने पर "Start Simulation" बटन दबाएं।',
            '3. आग लगने पर 3D विकल्पों में से सही उपकरण (Water vs Extinguisher vs Wet Cloth) चुनें।',
            '4. PASS तकनीक से आग बुझाएं।',
            '5. कमरे में घूमकर EMERGENCY FIRE EXIT (आपातकालीन निकास) ढूंढें और टैप करके बाहर निकलें!'
          ]
        }
      }
    },
    Santali: {
      modalBadge: 'DGMS AR ᱮᱛᱚᱦᱚᱵ ᱥᱮᱪᱮᱫ',
      title: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱯᱟᱵ ᱦᱚᱨᱟ',
      subtitle: 'AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱨᱮ ᱥᱟᱯᱟᱵ ᱪᱮᱫᱚᱜ ᱢᱮ',
      stepIndicator: 'ᱛᱷᱟᱯ',
      of: 'ᱨᱮᱱᱟᱜ',
      next: 'ᱫᱟᱨᱟᱭ ᱛᱷᱟᱯ',
      prev: 'ᱛᱟᱭᱚᱢ',
      startAR: 'AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱮᱦᱚᱵ ᱢᱮ',
      brokenSealSuccess: 'ᱥᱤᱞ ᱨᱟᱹᱯᱩᱫ ᱮᱱᱟ!',
      pulledPinSuccess: 'ᱯᱤᱱ ᱚᱰᱳᱠ ᱮᱱᱟ!',
      tapToBreak: 'ᱥᱤᱞ ᱨᱟᱹᱯᱩᱫ ᱞᱟᱹᱜᱤᱫ ᱴᱮᱯ ᱢᱮ',
      slidePullPin: 'ᱯᱤᱱ ᱚᱰᱳᱠ ᱞᱟᱹᱜᱤᱫ ᱴᱮᱯ ᱥᱮ ᱚᱨ ᱢᱮ',
      pullingPin: 'ᱯᱤᱱ ᱚᱰᱳᱠᱚᱜ ᱠᱟᱱᱟ...',
      replayPull: 'ᱯᱤᱱ ᱫᱚᱦᱲᱟ ᱧᱮᱞ ᱢᱮ',
      steps: {
        step1: {
          title: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱯᱟᱵ ᱜᱚᱲᱦᱚᱱ',
          desc: 'ᱠᱳᱭᱞᱟ ᱠᱷᱟᱫᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱞᱟᱦᱟ ᱨᱮ ᱥᱟᱯᱟᱵ ᱧᱮᱞ ᱵᱤᱰᱟᱹᱣ ᱢᱮ᱾ ᱜᱮᱡᱽ ᱦᱟᱹᱨᱭᱟᱹᱲ (Green) ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
          hotspotInstruction: 'ᱢᱩᱬ ᱦᱟᱹᱴᱤᱧ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱴᱮᱯ ᱢᱮ:',
          hotspots: [
            { id: 'gauge', title: 'ᱯᱨᱮᱥᱟᱨ ᱜᱮᱡᱽ', desc: 'ᱵᱷᱤᱛᱨᱤ ᱨᱮᱱᱟᱜ ᱯᱨᱮᱥᱟᱨ ᱫᱮᱠᱷᱟᱣᱟ᱾ ᱠᱟᱹᱴᱩᱵ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤ᱾' },
            { id: 'lever', title: 'ᱞᱤᱵᱷᱟᱨ ᱟᱨ ᱥᱟᱵ ᱦᱚᱨᱟ', desc: 'ᱞᱟᱛᱟᱨ ᱦᱮᱱᱰᱮᱞ ᱛᱮ ᱥᱟᱵ ᱢᱮ, ᱪᱮᱛᱟᱱ ᱞᱤᱵᱷᱟᱨ ᱛᱮ ᱯᱟᱣᱰᱟᱨ ᱚᱰᱳᱠᱚᱜᱼᱟ᱾' },
            { id: 'seal_pin', title: 'ᱥᱤᱞ ᱟᱨ ᱯᱤᱱ', desc: 'ᱵᱮᱵᱷᱟᱨ ᱞᱟᱦᱟ ᱨᱮ ᱱᱚᱶᱟ ᱚᱪᱚᱜ ᱦᱩᱭᱩᱜᱼᱟ᱾' },
            { id: 'hose', title: 'ᱦᱳᱡᱽ ᱯᱟᱭᱤᱯ', desc: 'ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱯᱟᱣᱰᱟᱨ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱯᱟᱭᱤᱯ᱾' },
            { id: 'body', title: 'ᱥᱴᱤᱞ ᱥᱤᱞᱤᱱᱰᱟᱨ', desc: 'ABC ᱯᱟᱣᱰᱟᱨ ᱛᱟᱦᱮᱸᱱᱟ ᱡᱟᱦᱟᱸ ᱠᱳᱭᱞᱟ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱟ᱾' }
          ]
        },
        step2: {
          title: 'ᱛᱷᱟᱯ ᱑: ᱥᱟᱥᱟᱝ ᱥᱤᱞ ᱨᱟᱹᱯᱩᱫ ᱢᱮ',
          desc: 'ᱥᱟᱥᱟᱝ ᱯᱞᱟᱥᱴᱤᱠ ᱥᱤᱞ ᱯᱤᱱ ᱮ ᱟᱴᱠᱟᱣ ᱫᱚᱦᱚᱭᱟ᱾ ᱯᱤᱱ ᱚᱪᱚᱜ ᱞᱟᱦᱟ ᱨᱮ ᱱᱚᱶᱟ ᱨᱟᱹᱯᱩᱫ ᱢᱮ᱾',
          actionHint: 'ᱥᱤᱞ ᱨᱟᱹᱯᱩᱫ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱛᱟᱨ ᱨᱮ ᱴᱮᱯ ᱢᱮ:',
          sealStatusLocked: 'ᱥᱤᱞ: ᱞᱚᱠ ᱢᱮᱱᱟᱜᱼᱟ',
          sealStatusUnlocked: 'ᱥᱤᱞ: ᱨᱟᱹᱯᱩᱫ ᱮᱱᱟ',
          explanation: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱚᱢ: ᱥᱤᱞ ᱵᱟᱝ ᱨᱟᱹᱯᱩᱫ ᱠᱟᱛᱮ ᱯᱤᱱ ᱟᱞᱚᱢ ᱚᱨᱟ᱾'
        },
        step3: {
          title: 'ᱛᱷᱟᱯ ᱒: ᱥᱩᱨᱟᱠᱷᱭᱟ ᱯᱤᱱ ᱚᱪᱚᱜ ᱢᱮ',
          desc: 'ᱥᱤᱞ ᱨᱟᱹᱯᱩᱫ ᱛᱟᱭᱚᱢ, ᱨᱤᱝ ᱯᱤᱱ ᱥᱚᱡᱷᱮ ᱚᱰᱳᱠ ᱢᱮ᱾ ᱱᱚᱶᱟ ᱛᱮ ᱞᱤᱵᱷᱟᱨ ᱠᱷᱩᱞᱟᱹᱣᱜᱼᱟ᱾',
          actionHint: 'ᱯᱤᱱ ᱚᱰᱳᱠ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱛᱟᱨ ᱨᱮ ᱴᱮᱯ ᱢᱮ:',
          pinStatusLocked: 'ᱯᱤᱱ: ᱞᱚᱠ ᱢᱮᱱᱟᱜᱼᱟ',
          pinStatusUnlocked: 'ᱯᱤᱱ: ᱚᱰᱳᱠ ᱮᱱᱟ',
          explanation: 'ᱦᱩᱥᱤᱭᱟᱹᱨ: ᱞᱟᱛᱟᱨ ᱦᱮᱱᱰᱮᱞ ᱥᱟᱵ ᱠᱟᱛᱮ ᱯᱤᱱ ᱚᱨ ᱢᱮ᱾'
        },
        step4: {
          title: 'ᱛᱷᱟᱯ ᱓: P.A.S.S. ᱦᱚᱨᱟ ᱟᱨ AR ᱠᱟᱹᱢᱤ',
          desc: 'ᱟᱢ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱯᱟᱵ ᱵᱮᱵᱷᱟᱨ ᱮᱢ ᱪᱮᱫ ᱠᱮᱫᱟ! AR ᱮᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱶᱟ ᱫᱤᱥᱟᱹ ᱫᱚᱦᱚᱭ ᱢᱮ:',
          passSummary: [
            { letter: 'P', title: 'PULL (ᱯᱤᱱ ᱚᱨ ᱢᱮ)', desc: 'ᱯᱤᱱ ᱵᱟᱦᱨᱮ ᱚᱨ ᱢᱮ᱾' },
            { letter: 'A', title: 'AIM (ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱫᱷᱮᱭᱟᱱ ᱢᱮ)', desc: 'ᱥᱮᱸᱜᱮᱞ ᱞᱟᱛᱟᱨ ᱯᱷᱮᱰ ᱨᱮ ᱴᱟᱨᱜᱮᱴ ᱢᱮ᱾' },
            { letter: 'S', title: 'SQUEEZE (ᱞᱤᱱ ᱢᱮ)', desc: 'ᱯᱟᱣᱰᱟᱨ ᱚᱰᱳᱠ ᱞᱟᱹᱜᱤᱫ ᱞᱤᱵᱷᱟᱨ ᱞᱤᱱ ᱢᱮ᱾' },
            { letter: 'S', title: 'SWEEP (ᱟᱹᱪᱩᱨ ᱢᱮ)', desc: 'ᱞᱮᱸᱜᱟ ᱠᱷᱚᱱ ᱡᱚᱡᱚᱢ ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱟᱹᱪᱩᱨ ᱢᱮ᱾' }
          ],
          missionFlowTitle: 'AR ᱨᱮ ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤ:',
          missionFlow: [
            '1. ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱚᱛ ᱟᱨ ᱠᱩᱴᱷᱨᱤ ᱥᱠᱮᱱ ᱢᱮ᱾',
            '2. ᱚᱛ ᱧᱟᱢ ᱞᱮᱱᱠᱷᱟᱱ "Start Simulation" ᱞᱤᱱ ᱢᱮ᱾',
            '3. ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱓ ᱜᱚᱴᱟᱝ ᱥᱟᱯᱟᱵ ᱠᱷᱚᱱ ᱴᱷᱤᱠ ᱥᱟᱯᱟᱵ (Water vs Extinguisher vs Wet Cloth) ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
            '4. PASS ᱦᱚᱨᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱮ᱾',
            '5. EMERGENCY FIRE EXIT ᱯᱟᱸᱡᱟᱭ ᱢᱮ ᱟᱨ ᱚᱰᱳᱠᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱴᱮᱯ ᱢᱮ!'
          ]
        }
      }
    }
  };

  const curLang = TEXTS[language] || TEXTS.English;
  const stepData = curLang.steps[`step${currentStep}`];

  const handleNext = () => {
    triggerHaptic(25);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    triggerHaptic(20);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBreakSeal = () => {
    triggerHaptic(50);
    setIsSealBroken(true);
  };

  const handlePullPinAnimation = () => {
    if (isPullingAnimation) return;
    setIsPullingAnimation(true);
    triggerHaptic(35);

    let frame = pinFrame >= 6 ? 0 : pinFrame;
    setPinFrame(frame);

    const interval = setInterval(() => {
      frame += 1;
      if (frame <= 6) {
        setPinFrame(frame);
        triggerHaptic(18);
      }
      if (frame >= 6) {
        clearInterval(interval);
        setIsPullingAnimation(false);
        setIsPinPulled(true);
        triggerHaptic(65);
      }
    }, 70);
  };

  const handleResetPin = () => {
    triggerHaptic(25);
    setIsPinPulled(false);
    setPinFrame(0);
  };

  // Touch gesture scrubbing for pin pulling
  const handleTouchStart = (e) => {
    if (isPinPulled || isPullingAnimation) return;
    const touch = e.touches[0];
    dragStartXRef.current = touch.clientX;
  };

  const handleTouchMove = (e) => {
    if (dragStartXRef.current === null || isPinPulled || isPullingAnimation) return;
    const touch = e.touches[0];
    // Pulling to the left: start - current > 0
    const deltaX = dragStartXRef.current - touch.clientX;
    if (deltaX > 0) {
      // 120px total drag distance spans 6 frames (~20px per frame)
      const targetFrame = Math.min(6, Math.max(0, Math.floor(deltaX / 18)));
      if (targetFrame !== currentFrameRef.current) {
        setPinFrame(targetFrame);
        triggerHaptic(15);
      }
    }
  };

  const handleTouchEnd = () => {
    if (dragStartXRef.current === null) return;
    dragStartXRef.current = null;
    if (isPinPulled || isPullingAnimation) return;

    if (currentFrameRef.current >= 4) {
      handlePullPinAnimation();
    } else if (currentFrameRef.current === 0) {
      handlePullPinAnimation();
    } else {
      setPinFrame(0);
      triggerHaptic(20);
    }
  };

  const speakCurrentStep = () => {
    triggerHaptic(15);
    if (!('speechSynthesis' in window)) return;
    
    if (isAudioSpeaking) {
      window.speechSynthesis.cancel();
      setIsAudioSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${stepData.title}. ${stepData.desc}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsAudioSpeaking(false);
    utterance.onerror = () => setIsAudioSpeaking(false);
    setIsAudioSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-fade-in text-slate-100 select-none">
      
      {/* Top Header */}
      <header className="px-5 py-3.5 border-b border-white/[0.08] bg-[#090A0F]/80 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                {curLang.modalBadge}
              </span>
              <span className="text-[10px] text-zinc-500">•</span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {curLang.stepIndicator} {currentStep} {curLang.of} 4
              </span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {curLang.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={speakCurrentStep}
            className={`p-2 rounded-lg border transition-all ${
              isAudioSpeaking 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' 
                : 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white'
            }`}
            title="Narration"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              if (isAudioSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Progress Track */}
      <div className="w-full bg-white/[0.04] h-1.5 flex shrink-0">
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s}
            className={`h-full flex-1 transition-all duration-300 border-r border-black/40 ${
              s < currentStep 
                ? 'bg-emerald-500' 
                : s === currentStep 
                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                  : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-w-lg mx-auto w-full">
        
        {/* Step Title & Description */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-zinc-300">
            <span>{curLang.stepIndicator} {currentStep}:</span>
            <span className="text-amber-400">{stepData.title}</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {stepData.desc}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: ANATOMY & INSPECTION */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            {/* Visual Extinguisher Diagram with Interactive Hotspots */}
            <div className="relative w-full max-w-[310px] aspect-[896/1200] mx-auto rounded-2xl bg-gradient-to-b from-[#0c1017] via-[#090b10] to-black border border-white/[0.1] overflow-hidden flex items-center justify-center shadow-2xl group">
              
              {/* Photorealistic Industrial Extinguisher Render */}
              <img 
                src="./module_images/fire_extinguisher_anatomy.jpg"
                alt="Industrial ABC Dry Chemical Fire Extinguisher Anatomy"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Ambient Radial Spotlight Highlight on Selected Hotspot */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: selectedHotspot === 'gauge' 
                    ? 'radial-gradient(circle at 49.9% 24.3%, rgba(34, 197, 94, 0.35) 0%, transparent 40%)'
                    : selectedHotspot === 'seal_pin'
                    ? 'radial-gradient(circle at 48.0% 13.3%, rgba(245, 158, 11, 0.35) 0%, transparent 40%)'
                    : selectedHotspot === 'lever'
                    ? 'radial-gradient(circle at 36.8% 10.0%, rgba(56, 189, 248, 0.35) 0%, transparent 40%)'
                    : selectedHotspot === 'body'
                    ? 'radial-gradient(circle at 52.5% 50.0%, rgba(239, 68, 68, 0.35) 0%, transparent 45%)'
                    : selectedHotspot === 'hose'
                    ? 'radial-gradient(circle at 69.8% 60.0%, rgba(168, 85, 247, 0.35) 0%, transparent 40%)'
                    : 'none'
                }}
              />

              {/* 1. Pressure Gauge Hotspot (Center Dial) */}
              <button 
                type="button"
                aria-label="Inspect Pressure Gauge"
                onClick={() => { triggerHaptic(25); setSelectedHotspot('gauge'); }}
                style={{ top: '24.3%', left: '49.9%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  selectedHotspot === 'gauge'
                    ? 'w-10 h-10 bg-emerald-500/40 border-2 border-emerald-300 ring-4 ring-emerald-500/40 scale-110 shadow-[0_0_24px_rgba(34,197,94,0.95)]'
                    : 'w-7 h-7 bg-emerald-500/30 border-2 border-emerald-400 hover:scale-110 shadow-[0_0_12px_rgba(34,197,94,0.7)]'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
              </button>

              {/* 2. Tamper Seal & Safety Pin Hotspot (Yellow clip & ring) */}
              <button 
                type="button"
                aria-label="Inspect Tamper Seal & Safety Pin"
                onClick={() => { triggerHaptic(25); setSelectedHotspot('seal_pin'); }}
                style={{ top: '13.3%', left: '48.0%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  selectedHotspot === 'seal_pin'
                    ? 'w-10 h-10 bg-amber-500/40 border-2 border-amber-300 ring-4 ring-amber-500/40 scale-110 shadow-[0_0_24px_rgba(245,158,11,0.95)]'
                    : 'w-7 h-7 bg-amber-500/30 border-2 border-amber-400 hover:scale-110 shadow-[0_0_12px_rgba(245,158,11,0.7)]'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse"></span>
              </button>

              {/* 3. Operating Lever & Carry Handle Hotspot (Upper trigger) */}
              <button 
                type="button"
                aria-label="Inspect Operating Lever & Carry Handle"
                onClick={() => { triggerHaptic(25); setSelectedHotspot('lever'); }}
                style={{ top: '10.0%', left: '36.8%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  selectedHotspot === 'lever'
                    ? 'w-10 h-10 bg-sky-500/40 border-2 border-sky-300 ring-4 ring-sky-500/40 scale-110 shadow-[0_0_24px_rgba(56,189,248,0.95)]'
                    : 'w-7 h-7 bg-sky-500/30 border-2 border-sky-400 hover:scale-110 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-sky-300 animate-pulse"></span>
              </button>

              {/* 4. Heavy-Gauge Steel Cylinder Hotspot (Red Body & Label) */}
              <button 
                type="button"
                aria-label="Inspect Cylinder Body"
                onClick={() => { triggerHaptic(25); setSelectedHotspot('body'); }}
                style={{ top: '50.0%', left: '52.5%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  selectedHotspot === 'body'
                    ? 'w-10 h-10 bg-red-500/40 border-2 border-red-300 ring-4 ring-red-500/40 scale-110 shadow-[0_0_24px_rgba(239,68,68,0.95)]'
                    : 'w-7 h-7 bg-red-500/30 border-2 border-red-400 hover:scale-110 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-300 animate-pulse"></span>
              </button>

              {/* 5. High-Pressure Discharge Hose & Horn Hotspot (Nozzle Horn) */}
              <button 
                type="button"
                aria-label="Inspect Discharge Hose & Horn"
                onClick={() => { triggerHaptic(25); setSelectedHotspot('hose'); }}
                style={{ top: '60.0%', left: '69.8%' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  selectedHotspot === 'hose'
                    ? 'w-10 h-10 bg-purple-500/40 border-2 border-purple-300 ring-4 ring-purple-500/40 scale-110 shadow-[0_0_24px_rgba(168,85,247,0.95)]'
                    : 'w-7 h-7 bg-purple-500/30 border-2 border-purple-400 hover:scale-110 shadow-[0_0_12px_rgba(168,85,247,0.7)]'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-purple-300 animate-pulse"></span>
              </button>
            </div>

            {/* Selected Hotspot Details Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {stepData.hotspotInstruction}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {stepData.hotspots.map((h, idx) => {
                  const isSelected = selectedHotspot === h.id;
                  const isLastOdd = idx === stepData.hotspots.length - 1 && stepData.hotspots.length % 2 !== 0;
                  
                  const colors = {
                    gauge: { border: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-400' },
                    lever: { border: 'border-sky-500/40 bg-sky-500/15 text-sky-300', dot: 'bg-sky-400' },
                    seal_pin: { border: 'border-amber-500/40 bg-amber-500/15 text-amber-300', dot: 'bg-amber-400' },
                    body: { border: 'border-red-500/40 bg-red-500/15 text-red-300', dot: 'bg-red-400' },
                    hose: { border: 'border-purple-500/40 bg-purple-500/15 text-purple-300', dot: 'bg-purple-400' }
                  }[h.id] || { border: 'border-amber-500/40 bg-amber-500/15 text-amber-300', dot: 'bg-amber-400' };

                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => { triggerHaptic(20); setSelectedHotspot(h.id); }}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-1.5 ${
                        isLastOdd ? 'col-span-2' : ''
                      } ${
                        isSelected 
                          ? `${colors.border} shadow-lg font-bold ring-1 ring-white/10` 
                          : 'bg-black/30 border-white/[0.06] text-zinc-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot} ${isSelected ? 'animate-pulse' : ''}`} />
                        <span className="font-semibold truncate">{h.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-50 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </button>
                  );
                })}
              </div>

              {selectedHotspot && (
                <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-white/[0.1] text-xs text-zinc-200 leading-relaxed animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-400 block text-xs">
                      {stepData.hotspots.find(h => h.id === selectedHotspot)?.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">DGMS COMPONENT</span>
                  </div>
                  <p className="text-zinc-300">
                    {stepData.hotspots.find(h => h.id === selectedHotspot)?.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: BREAKING THE TAMPER SEAL */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            {/* Photorealistic Tamper Seal Close-Up Visual Card */}
            <div className="relative w-full max-w-[340px] aspect-[4/3] mx-auto rounded-2xl bg-gradient-to-b from-[#0c1017] via-[#090b10] to-black border border-white/[0.1] overflow-hidden flex items-center justify-center shadow-2xl group">
              
              {/* Image Transition between Intact and Broken Seal on Extinguisher Top */}
              <img 
                src={isSealBroken ? "./module_images/extinguisher_seal_broken.jpg" : "./module_images/extinguisher_seal_intact.jpg"}
                alt={isSealBroken ? "Broken Tamper Seal on Extinguisher Top" : "Intact Tamper Seal on Extinguisher Top"}
                className={`w-full h-full object-cover transition-all duration-500 pointer-events-none select-none ${
                  isSealBroken ? 'scale-[1.01] brightness-105' : 'group-hover:scale-[1.01]'
                }`}
              />

              {/* Radial Spotlight on Yellow Seal */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  background: isSealBroken
                    ? 'radial-gradient(circle at 41.7% 29.5%, rgba(34, 197, 94, 0.35) 0%, transparent 42%)'
                    : 'radial-gradient(circle at 41.7% 29.5%, rgba(245, 158, 11, 0.4) 0%, transparent 42%)'
                }}
              />

              {/* Interactive Break Touch Target on the Yellow Seal (Clean Reticle, No Text) */}
              {!isSealBroken && (
                <button
                  type="button"
                  aria-label="Tap to Snap Tamper Seal"
                  onClick={handleBreakSeal}
                  style={{ top: '29.5%', left: '41.7%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500/25 border-2 border-amber-300 ring-4 ring-amber-500/30 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.8)] active:scale-90 transition-transform z-10 cursor-pointer"
                >
                  <span className="w-3 h-3 rounded-full bg-amber-300 shadow-md"></span>
                </button>
              )}
            </div>

            {/* Interactive Action Button or Success Card */}
            {!isSealBroken ? (
              <button
                type="button"
                onClick={handleBreakSeal}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-zinc-950" />
                <span>{curLang.tapToBreak}</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-xs animate-fade-in shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{curLang.brokenSealSuccess}</div>
                    <div className="text-[10px] text-emerald-400/90">Safety pin lock mechanism is now accessible.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px] uppercase tracking-wider transition-colors shadow-sm"
                >
                  {curLang.next} &rarr;
                </button>
              </div>
            )}

            {/* Safety Guidance Note */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-400 leading-relaxed">
              <span className="font-bold text-white block mb-1">DGMS Standard Note:</span>
              {stepData.explanation}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PULLING THE SAFETY PIN (FRAME ANIMATION) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            {/* Sequential Frame Animation Card */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[340px] aspect-[4/3] mx-auto rounded-2xl bg-gradient-to-b from-[#0c1017] via-[#090b10] to-black border border-white/[0.1] overflow-hidden flex items-center justify-center shadow-2xl group touch-none cursor-grab active:cursor-grabbing"
            >
              {/* Sequential Frame Image Render */}
              <img 
                src={`./module_images/pin_frame_${pinFrame}.jpg`}
                alt={`Safety Pin Frame ${pinFrame} of 6`}
                className="w-full h-full object-cover pointer-events-none select-none drop-shadow-2xl transition-all"
              />

              {/* Radial Spotlight on Pin Location */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: isPinPulled
                    ? 'radial-gradient(circle at 46.5% 27.0%, rgba(34, 197, 94, 0.35) 0%, transparent 40%)'
                    : isPullingAnimation
                    ? 'radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.45) 0%, transparent 45%)'
                    : 'radial-gradient(circle at 40.5% 35.2%, rgba(56, 189, 248, 0.4) 0%, transparent 45%)'
                }}
              />

              {/* Interactive Metal Pull Pin Ring Target (Clean Reticle, No Text) */}
              {!isPinPulled && !isPullingAnimation && (
                <button
                  type="button"
                  aria-label="Tap or swipe to Extract Safety Pin"
                  onClick={handlePullPinAnimation}
                  style={{ top: '35.2%', left: '40.5%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-sky-500/25 border-2 border-sky-300 ring-4 ring-sky-500/30 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.8)] active:scale-90 transition-transform z-10 cursor-pointer"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-300 shadow-md"></span>
                </button>
              )}

              {/* Minimal Frame Stepper Dots at Bottom */}
              <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center gap-1.5 z-20 pointer-events-none">
                {[0, 1, 2, 3, 4, 5, 6].map((f) => (
                  <span 
                    key={f}
                    className={`h-1 rounded-full transition-all duration-200 ${
                      pinFrame === f 
                        ? 'w-5 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]' 
                        : f < pinFrame
                        ? 'w-2 bg-emerald-400'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive Action Button or Success Card */}
            {!isPinPulled ? (
              <button
                type="button"
                onClick={handlePullPinAnimation}
                disabled={isPullingAnimation}
                className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  isPullingAnimation ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                <Unlock className="w-4 h-4 stroke-[2.5]" />
                <span>{isPullingAnimation ? curLang.pullingPin : curLang.slidePullPin}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-xs animate-fade-in shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{curLang.pulledPinSuccess}</div>
                      <div className="text-[10px] text-emerald-400/90">Trigger lever is unlocked. Ready for PASS protocol.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px] uppercase tracking-wider transition-colors shadow-sm"
                  >
                    {curLang.next} &rarr;
                  </button>
                </div>

                {/* Replay Frame Animation Button */}
                <button
                  type="button"
                  onClick={handleResetPin}
                  className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{curLang.replayPull}</span>
                </button>
              </div>
            )}

            {/* Safety Guidance Note */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-400 leading-relaxed">
              <span className="font-bold text-white block mb-1">DGMS Technical Rule:</span>
              {stepData.explanation}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PASS PROTOCOL & AR SIMULATION BRIEFING */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            {/* PASS 4-Step Summary Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {stepData.passSummary.map((item) => (
                <div 
                  key={item.letter}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
                    {item.letter}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-white leading-tight">{item.title}</h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mission Flow Checklist */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>{stepData.missionFlowTitle}</span>
              </div>
              <div className="space-y-1.5">
                {stepData.missionFlow.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Launch AR CTA Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(50);
                if (isAudioSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                onStartAR();
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-5 h-5 fill-zinc-950 group-hover:scale-110 transition-transform" />
              <span>{curLang.startAR}</span>
            </button>
          </div>
        )}

      </div>

      {/* Bottom Navigation Toolbar */}
      <footer className="px-5 py-3.5 border-t border-white/[0.08] bg-[#090A0F]/90 flex justify-between items-center shrink-0">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentStep === 1 
              ? 'opacity-30 text-zinc-600 pointer-events-none' 
              : 'bg-white/[0.05] border border-white/[0.08] text-zinc-300 hover:text-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{curLang.prev}</span>
        </button>

        {currentStep < 4 && (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <span>{curLang.next}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </footer>

    </div>
  );
}
