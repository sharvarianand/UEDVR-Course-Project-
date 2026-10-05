// ==============================================================================
// Industrial Mine Safety Training: PPE & Workface Hazard Inspection Curriculum
// Formatted for Directorate General of Mines Safety (DGMS) Standards
// Trilingual: English, Hindi (हिन्दी), Santali (ᱥᱟᱱᱛᱟᱲᱤ - Ol Chiki)
// ==============================================================================

export const PPE_COURSE_DATA = {
  English: {
    courseTitle: "PPE & Workface Hazard Inspection",
    courseSubtitle: "DGMS Mandatory Underground Safety Standard",
    badgeLabel: "DGMS STANDARD 2026",
    part1Title: "Part 1: Personal Protective Equipment (PPE)",
    part1Subtitle: "Fundamental life-saving equipment and daily pre-shift inspection",
    part2Title: "Part 2: Workface Hazard Identification",
    part2Subtitle: "Underground strata sounding, toxic gases, and mechanical safety",
    scenarioTitle: "Field Scenario: Critical PPE Selection",
    scenarioSubtitle: "DGMS Section 22 Practical Simulation Assessment",
    startScenarioBtn: "Begin Practical Scenario (40 Pts)",
    continueToQuiz1Btn: "Continue to Quiz 1",
    quiz1Title: "Part 1 Knowledge Check: PPE Inspection",
    quiz2Title: "Part 2 Final Assessment: Hazard Detection",
    startQuiz1Btn: "Take PPE Quiz",
    startPart2Btn: "Continue to Part 2: Hazard Inspection",
    startQuiz2Btn: "Take Final Hazard Quiz",
    finishCourseBtn: "Complete & Certify Module",
    nextBtn: "Next Page",
    prevBtn: "Previous",
    audioNarrateBtn: "Listen (Audio)",
    pageIndicator: "Page",
    ofText: "of",

    // Part 1: 6 In-Depth Learning Pages
    part1Pages: [
      {
        id: "ppe_helmet",
        tag: "CRITICAL LIFE SAFETY • HEAD PROTECTION",
        title: "1. Industrial Mining Helmet & Cap Lamp",
        image: "./module_images/ppe_helmet.jpg",
        keyStandard: "DGMS / IS 2925 Standard Certified",
        description: "Underground coal mines present constant risks of falling rock fragments, low roof strikes, and total darkness. The industrial mining helmet protects against top impacts of up to 5,000 Newtons while serving as the primary mount for the worker's cordless LED cap lamp.",
        bulletPoints: [
          "Shell Inspection: Examine outer fiberglass/high-density polyethylene shell daily for hairline cracks, ultraviolet degradation, or impact dents.",
          "Suspension Harness: Maintain a strict 25mm to 30mm clearance between the crown of the head and the outer shell. A sagging harness transfers impact directly to the skull.",
          "Adjustable Chin Strap: Must remain securely fastened under the jaw at all times to prevent helmet loss during roof vibrations or slips.",
          "Cordless Cap Lamp: Ensure battery charge provides at least 14 hours of continuous 4,500+ lux illumination with secondary emergency LED mode."
        ],
        cautionTip: "Never store gloves, cigarette lighters, or rags inside the helmet crown. Anything between your head and the suspension ruins impact absorption."
      },
      {
        id: "ppe_goggles",
        tag: "VISION INTEGRITY • EYE & FACE PROTECTION",
        title: "2. Anti-Fog Ballistic Goggles & Visor",
        image: "./module_images/ppe_goggles.jpg",
        keyStandard: "EN 166 Grade B / ANSI Z87.1+",
        description: "High-speed continuous miners, roadheaders, and pneumatic pick drills generate cloud bursts of high-velocity coal chips and stone shrapnel. Standard reading glasses or non-rated sunglasses shatter instantly upon impact.",
        bulletPoints: [
          "Dual-Layer Anti-Fog Coating: Underground humidity often exceeds 90%. Vented dual-pane thermal lenses prevent condensation blinding.",
          "Impact Rating: Polycarbonate lenses must withstand a 6mm steel ball travelling at 120 meters/second without cracking or dislodging.",
          "Silicone Facial Seal: Forms a gentle, dust-tight perimeter around the orbital bone, preventing microscopic coal dust from irritating corneas.",
          "Full Mesh/Polycarbonate Visor: Required during drilling, roof bolting, and secondary rock breaking against large spalling chunks."
        ],
        cautionTip: "Wiping coal dust with dirty cotton gloves scratches the optical lens and creates glare halos under cap lamps. Rinse lenses with clean water only."
      },
      {
        id: "ppe_respirator",
        tag: "RESPIRATORY DEFENSE • DUST & RESCUE",
        title: "3. P100 Respirator & Self-Rescuer (SCSR)",
        image: "./module_images/ppe_respirator.jpg",
        keyStandard: "DGMS Circular No. 04 / IS 9473",
        description: "Respirable coal dust causes irreversible Coal Workers' Pneumoconiosis (Black Lung), while crystalline silica causes Silicosis. In fire emergencies, Carbon Monoxide causes fatal asphyxiation within 3 minutes without a Self-Rescuer.",
        bulletPoints: [
          "Dual P100 Particulate Filters: Filters 99.97% of airborne respirable particles down to 0.3 microns. Replace filters when breathing resistance increases.",
          "Pre-Shift Seal Check: Perform positive and negative pressure checks before entering cage: cover exhalation valve and blow gently; no air should escape edges.",
          "Filter Orientation: Always align filter cartridge bayonets securely until an audible click is felt.",
          "Filter Self-Rescuer (FSR) / SCSR: Wear on belt at all times. In emergency, don within 30 seconds to convert toxic CO into harmless CO2 for 60+ minutes."
        ],
        cautionTip: "A respirator with damaged silicone valves or worn headband elasticity permits contaminated air to bypass the filter directly into your lungs."
      },
      {
        id: "ppe_boots",
        tag: "LOCOMOTION DEFENSE • FOOT & LEG PROTECTION",
        title: "4. Steel-Toed Boots with Metatarsal Guard",
        image: "./module_images/ppe_boots.jpg",
        keyStandard: "IS 15298 (Part 2) / DGMS Approved",
        description: "Underground haulage roadways feature muddy slurry, sharp blasted shale, and rolling heavy mine tubs. Standard boots offer zero resistance against crushed toes or nail punctures through the sole.",
        bulletPoints: [
          "200-Joule Steel Toe Cap: Resists drop impacts from falling roof rock up to 20kg dropped from 1 meter height.",
          "External Metatarsal Guard: Articulated protective plate covering delicate instep bones against side rolling tub pinch points.",
          "Puncture-Resistant Steel Midsole: Prevents rusted rail spikes and protruding roof bolts from piercing through the outsole.",
          "Anti-Static Oil-Resistant Tread: Deep chevron cleats prevent slips on inclined seam haulage planes while dissipating static sparks."
        ],
        cautionTip: "Inspect boot leather daily for cracks that expose internal steel. Damaged boots conduct electrical current and retain hazardous acidic mine water."
      },
      {
        id: "ppe_suit",
        tag: "VISIBILITY & FLAME RETARDANCE • BODY COVER",
        title: "5. High-Visibility Anti-Static Overalls",
        image: "./module_images/module_ppe_hazard_hero.jpg",
        keyStandard: "DGMS / ISO 20471 Class 3",
        description: "Underground haulage locos, shuttle cars, and load-haul-dump (LHD) operators have limited peripheral visibility. Wearing dark cotton clothing makes miners virtually invisible in underground shadows.",
        bulletPoints: [
          "3M Micro-Prismatic Reflective Strips: 50mm wide reflective bands over shoulders, arms, and legs create a luminous 360° silhouette when illuminated by cap lamps from 150m.",
          "Flame-Retardant Fabric: 100% treated cotton or Nomex blend self-extinguishes within 2 seconds of exposure to methane flashes or electrical arcs.",
          "Anti-Static Carbon Threading: Dissipates triboelectric friction charges so walking across rubber belts cannot generate an electrostatic spark.",
          "Snug Cuffs & Ankles: Prevents loose fabric from being dragged into spinning conveyor tail drums or continuous miner gathering arms."
        ],
        cautionTip: "Synthetic polyester or nylon shirts melt under heat and fuse directly into the skin. Never wear synthetic underwear or shirts underground."
      },
      {
        id: "ppe_inspection",
        tag: "PROCEDURAL AUDIT • DAILY PROTOCOL",
        title: "6. Pre-Shift Checklist & Buddy Audit",
        image: "./module_images/module_ppe_hazard_hero.jpg",
        keyStandard: "DGMS Form-IV Pre-Shift Audit",
        description: "No worker is permitted to step into the pithead cage without completing the mandatory 2-minute buddy audit with their team partner. Mutual inspection catches compromised gear that the wearer cannot see.",
        bulletPoints: [
          "1. Top-to-Bottom Scan: Partner inspects helmet shell, lamp bracket lock, chin strap tension, and rear battery cable guide.",
          "2. Cap Lamp Lumen Test: Shined against partner's hand at 1 meter; beam must be bright white without yellow flickering or broken switch seals.",
          "3. Respirator Fit & Seals: Ensure silicone half-mask is seated flush against skin; workers with full beards cannot achieve an airtight respiratory seal.",
          "4. SCSR Belt Seal: Verify intact lead security seal and moisture indicator pill is green/clear (pink indicates water ingress requiring replacement).",
          "5. Metatarsal Guard & Boots: Confirm laces are tightly tied without loose trailing loops that snag rail turnouts."
        ],
        cautionTip: "If any component fails inspection, report immediately to the Safety Lamp Room for replacement before boarding the descent shaft."
      }
    ],

    // Scenario Assessment (Before Quiz 1 • 40 Points)
    scenarioAssessment: {
      id: "scenario_face_entry",
      badge: "DGMS SECTION 22 • PRACTICAL SCENARIO",
      title: "Workface Entry Critical PPE Selection",
      scenarioText: "You are tasked with entering an active heading face beneath an unsupported drummy sandstone roof with dripping acid water. High-speed roadheader vibrations are causing sharp shale chunks to fall from the roof in total darkness.",
      questionPrompt: "Select the critical primary PPE from the 4 equipment options below that MUST be inspected and worn first to survive falling rock impacts and provide continuous hands-free illumination:",
      points: 40,
      options: [
        {
          id: "ppe_helmet",
          title: "Mining Helmet & Cordless Cap Lamp",
          subtitle: "DGMS / IS 2925 • 25-30mm Suspension",
          image: "./module_images/ppe_helmet.jpg",
          isCorrect: true,
          tag: "HEAD DEFENSE & SIGHT"
        },
        {
          id: "ppe_goggles",
          title: "Anti-Fog Ballistic Dual-Pane Goggles",
          subtitle: "EN 166 Grade B • 120m/s Impact",
          image: "./module_images/ppe_goggles.jpg",
          isCorrect: false,
          tag: "EYE PROTECTION"
        },
        {
          id: "ppe_respirator",
          title: "P100 Silicone Respirator & SCSR",
          subtitle: "IS 9473 • 99.97% Particulate HEPA",
          image: "./module_images/ppe_respirator.jpg",
          isCorrect: false,
          tag: "RESPIRATORY DEFENSE"
        },
        {
          id: "ppe_boots",
          title: "Steel-Toe Boots with Metatarsal Guard",
          subtitle: "IS 15298 • 200J Impact Resistance",
          image: "./module_images/ppe_boots.jpg",
          isCorrect: false,
          tag: "FOOT & CRUSH DEFENSE"
        }
      ],
      correctExplanation: "Under DGMS Standard IS 2925, an industrial hard hat with secured chin strap and cordless 4,500+ lux cap lamp is the non-negotiable primary safeguard required before stepping into dark unsupported heading faces subject to overhead roof falls.",
      incorrectExplanation: "While this equipment is vital for underground work, head impact defense and active illumination are the urgent first prerequisites to avoid fatal head injury and see immediate roof hazards."
    },

    // Quiz 1: 7 DGMS MCQs based on Part 1
    quiz1Questions: [
      {
        id: "q1_1",
        question: "What is the mandatory clearance between the crown of the head and the hard hat outer shell?",
        options: [
          "0 mm (resting directly on the head)",
          "10 mm to 15 mm",
          "25 mm to 30 mm",
          "Over 60 mm"
        ],
        correctIndex: 2,
        explanation: "A 25mm to 30mm clearance allows the internal nylon suspension harness to stretch and decelerate impact energy without the shell hitting the skull."
      },
      {
        id: "q1_2",
        question: "Why are synthetic clothing materials (like pure polyester or nylon) strictly prohibited underground?",
        options: [
          "They are too cold to wear in mine shafts",
          "They melt under heat and fuse into human skin during a flash",
          "They damage multi-gas detector sensors",
          "They make too much acoustic noise"
        ],
        correctIndex: 1,
        explanation: "Synthetic fibers melt into molten plastic during methane flash fires or electrical arcs, causing severe third-degree burns. Only flame-retardant treated cotton or Nomex is allowed."
      },
      {
        id: "q1_3",
        question: "On a Self-Contained Self-Rescuer (SCSR), what does a pink or red moisture indicator pill signify?",
        options: [
          "The apparatus is fully charged and ready",
          "Airborne humidity has breached the canister; it is condemned and unsafe",
          "The chemical oxygen candle is pre-heated",
          "Battery level is at 50%"
        ],
        correctIndex: 1,
        explanation: "A pink moisture indicator proves atmospheric moisture has entered the chemical canister, ruining the potassium superoxide (KO2). It must be discarded immediately."
      },
      {
        id: "q1_4",
        question: "What is the minimum continuous operational illumination time and brightness required for an underground cordless cap lamp?",
        options: [
          "6 hours at 1,000 lux",
          "8 hours at 2,000 lux",
          "14 hours at 4,500+ lux with secondary emergency reserve",
          "24 hours at 500 lux"
        ],
        correctIndex: 2,
        explanation: "DGMS standard mandates cordless LED cap lamps to supply at least 14 hours of continuous 4,500+ lux illumination to safely cover double shifts and unexpected delays."
      },
      {
        id: "q1_5",
        question: "What is the primary safety function of the metatarsal guard built into mining boots?",
        options: [
          "To protect the delicate bridge bones between the toes and ankle from heavy falling rock impacts",
          "To insulate the bottom of feet from cold acidic mine water",
          "To improve climbing traction on cage ropes",
          "To prevent static electrical spark discharge"
        ],
        correctIndex: 0,
        explanation: "While the steel toe protects the 5 phalanges, the metatarsal shield protects the fragile bridge bones of the foot against crushing from rock falls and heavy equipment."
      },
      {
        id: "q1_6",
        question: "How should coal dust accumulation on anti-fog ballistic goggles be cleaned underground?",
        options: [
          "Wiped forcefully with a dusty cotton glove",
          "Scraped off with a wire brush or scraper",
          "Scrubbed with kerosene or diesel fuel",
          "Rinsed with clean potable water and allowed to drip dry"
        ],
        correctIndex: 3,
        explanation: "Wiping lenses with gritty gloves or work overalls scratches the optical anti-fog coating and creates blinding glare halos under cap lamps. Only clean rinse water is permitted."
      },
      {
        id: "q1_7",
        question: "What prevents an underground miner from achieving an airtight seal on a P100 silicone dust respirator?",
        options: [
          "Wearing standard earplugs",
          "Wearing a battery belt pouch",
          "Having facial hair or a full beard along the silicone sealing edge",
          "Wearing high-visibility overalls"
        ],
        correctIndex: 2,
        explanation: "Facial hair breaks the microscopic perimeter seal against human skin, allowing respirable coal dust and carcinogenic crystalline silica to bypass the P100 filter directly into the lungs."
      }
    ],

    // Part 2: 5 In-Depth Hazard Inspection Pages
    part2Pages: [
      {
        id: "hazard_gas",
        tag: "ATMOSPHERIC TOXICITY • DGMS REGULATION 140",
        title: "1. Underground Toxic & Explosive Gas Hazards",
        image: "./module_images/hazard_gas_ch4.jpg",
        keyStandard: "DGMS Multi-Gas Limit Standards",
        description: "Underground coal seams continuously release hazardous gases trapped within coal fissures. The four principal gases monitored constantly are Methane (CH4), Carbon Monoxide (CO), Hydrogen Sulfide (H2S), and Oxygen deficiency (O2).",
        bulletPoints: [
          "Methane (CH4) Firedamp: Explosive between 5% and 15% in air. All work must stop and electrical power cut if CH4 reaches 1.25% at the coal face.",
          "Carbon Monoxide (CO) Whitedamp: Highly toxic byproduct of coal spontaneous combustion. Lethal at 0.1% (1,000 ppm) within minutes.",
          "Oxygen (O2) Blackdamp: Normal air contains 20.9% O2. If O2 drops below 19.0%, cognitive impairment and unconsciousness occur.",
          "Detector Verification: Bump-test 4-gas optical sensor detector at pithead before every shift. Wear detector in your breathing zone (chest pocket)."
        ],
        cautionTip: "Methane is lighter than air and accumulates near the mine roof, while Carbon Dioxide is heavy and settles in sumps and dips. Always test high and low."
      },
      {
        id: "hazard_roof",
        tag: "STRATA STABILITY • ROOF & SIDE FALL HAZARD",
        title: "2. Roof Strata Acoustic Sounding & Fractures",
        image: "./module_images/hazard_roof_fracture.jpg",
        keyStandard: "Systematic Support Rule (SSR) / DGMS",
        description: "Roof and side falls account for over 40% of underground mining fatalities. Before advancing into newly blasted or cut galleries, miners must sound the roof using a standardized brass sounding rod.",
        bulletPoints: [
          "Acoustic Sounding Technique: Tap roof strata lightly with sounding rod while touching the rock adjacent with an open palm to feel vibrations.",
          "Solid Roof Sound: Produces a clear, high-pitched ringing sound with zero noticeable vibration on your fingertip.",
          "Drummy / Loose Roof Sound: Produces a hollow, dull, drum-like thud accompanied by detectable vibration, indicating separation along bedding planes.",
          "Immediate Action: Never step beneath unbolted or drummy roof. Erect temporary mechanical prop supports immediately or retreat behind the last row of bolts."
        ],
        cautionTip: "Never rely on eye inspection alone. Micro-fractures and parting planes hidden above the visible coal layer can only be detected acoustically."
      },
      {
        id: "hazard_conveyor",
        tag: "MECHANICAL DANGER • ROTATING HAULAGE",
        title: "3. Belt Conveyors & Nip Point Entanglement",
        image: "./module_images/hazard_conveyor_belt.jpg",
        keyStandard: "DGMS Safety Circular / Indian Electricity Rule",
        description: "Underground trunk belt conveyors operate at speeds up to 3.5 meters per second with immense torque. Rotating pulleys and roller pinch points will instantly drag in limbs and crush bodies.",
        bulletPoints: [
          "Emergency Pull-Wire Cord: Must run unobstructed along the entire length of the conveyor. Pulling the wire trips the master contactor instantaneously.",
          "Nip Point Guards: Heavy steel mesh covers must surround head pulleys, tail tension drums, and snub rollers to prevent physical contact.",
          "Zero Cleaning Rule: Never use a hand shovel or scraper to clear coal spillage around the return belt while the conveyor is in motion.",
          "Crossing Bridges: Only cross conveyor lines using designated steel footbridges with handrails. Stepping over a live moving belt is strictly prohibited."
        ],
        cautionTip: "Loose overalls or hanging cap lamp cables near conveyor rollers create fatal entanglement traps. Keep all gear zipped and tucked."
      },
      {
        id: "hazard_flameproof",
        tag: "EXPLOSION PREVENTION • FLP ELECTRICAL APPARATUS",
        title: "4. Flameproof Enclosures (FLP) & Contraband",
        image: "./module_images/hazard_gas_ch4.jpg",
        keyStandard: "DGMS / IS/IEC 60079-1 Flameproof",
        description: "Underground electrical switchgear, transformers, and electric motors must be housed in heavy-gauge Flameproof (FLP) enclosures. An internal electrical spark must never ignite flammable methane in the mine atmosphere.",
        bulletPoints: [
          "Flameproof Flange Gaps: Heavy machined steel flanges cool escaping hot gas below methane ignition temperature (650°C). Gaps must not exceed 0.5mm.",
          "Bolt Integrity: All enclosure perimeter bolts must be present, fully torqued with spring washers. A single missing bolt renders the apparatus illegal and dangerous.",
          "Zero Open Arc Maintenance: Never open an electrical terminal enclosure while line power is active. Implement strict LOTO isolation first.",
          "Strict Contraband Prohibition: Matches, lighters, cigarettes, non-intrinsically safe smartphones, and commercial smartwatches are strictly illegal underground."
        ],
        cautionTip: "Ordinary mobile phone batteries can produce a tiny contact spark that triggers a catastrophic firedamp coal dust explosion."
      },
      {
        id: "hazard_evacuation",
        tag: "CRITICAL SURVIVAL • EMERGENCY EVACUATION",
        title: "5. Refuge Bays, Lifelines & Evacuation Egress",
        image: "./module_images/hazard_water_inrush.jpg",
        keyStandard: "DGMS Emergency Preparedness Plan (EPP)",
        description: "In the event of an underground mine explosion, fire, or massive inundation, visibility drops to zero due to thick smoke. Miners must instinctively navigate outbye along sensory lifelines.",
        bulletPoints: [
          "Tactile Lifeline Cones: Tactile directional cones attached to lifeline rope point toward the fresh air shaft. Feeling the cone vertex confirms you are moving towards safety.",
          "Refuge Chamber Station: Airtight steel shelter with 48-hour compressed oxygen cylinders, scrubber filters, potable water, and intrinsically safe phone to surface.",
          "Don SCSR Immediately: Never waste time looking for tools or walking without your breathing mask once toxic smoke or alarms are sensed.",
          "Crawl in Smoke: Hot toxic Carbon Monoxide rises to the roof. Stay low to the ground where cooler, cleaner air pockets remain longer."
        ],
        cautionTip: "Never take off your SCSR mouthpiece to speak to coworkers in smoke. A single breath of 0.5% CO can cause immediate loss of consciousness."
      }
    ],

    // Quiz 2: 7 DGMS MCQs based on Part 2
    quiz2Questions: [
      {
        id: "q2_1",
        question: "At what concentration of Methane (CH4) at the coal face must all work cease and electrical power be disconnected?",
        options: [
          "0.50%",
          "1.25%",
          "5.00%",
          "15.00%"
        ],
        correctIndex: 1,
        explanation: "DGMS Coal Mine Regulations require that if methane reaches 1.25% at the working face, all electric power must be immediately isolated and personnel evacuated to intake airway."
      },
      {
        id: "q2_2",
        question: "When sounding underground mine roof strata with a sounding rod, what does a dull, drum-like thud indicate?",
        options: [
          "The rock is solid granite and completely safe",
          "There is a loose, fractured coal or stone slab detached from the main roof",
          "The sounding rod is made of incorrect brass alloy",
          "A fresh air ventilation current is passing through"
        ],
        correctIndex: 1,
        explanation: "A dull, hollow, or 'drummy' sound accompanied by fingertip vibration warns that a strata slab has separated from the main roof and is prone to collapse."
      },
      {
        id: "q2_3",
        question: "How do tactile directional cones on an underground emergency lifeline guide miners in zero-visibility smoke?",
        options: [
          "They emit a loud ultrasonic beeping chime",
          "The narrow pointed cone vertex points in the direction of fresh air and safety",
          "They illuminate with solar luminescence",
          "They trigger water sprinkler heads"
        ],
        correctIndex: 1,
        explanation: "In zero-visibility smoke, miners slide their hand along the lifeline. The cones are shaped so the pointed vertex directs miners outward towards the fresh air intake shaft."
      },
      {
        id: "q2_4",
        question: "What is the permissible continuous exposure limit for Carbon Monoxide (CO) gas in an active underground coal workface?",
        options: [
          "Less than 50 PPM (Parts Per Million)",
          "250 PPM",
          "1,000 PPM",
          "5,000 PPM"
        ],
        correctIndex: 0,
        explanation: "Carbon Monoxide binds to hemoglobin 210 times faster than oxygen. DGMS mandates an active workface ceiling below 50 PPM; concentrations exceeding 0.1% (1,000 PPM) cause loss of consciousness within minutes."
      },
      {
        id: "q2_5",
        question: "How does a Flameproof (FLP) electrical enclosure prevent an underground explosion?",
        options: [
          "By maintaining an absolute vacuum seal inside the switchbox",
          "By absorbing sparks using internal liquid nitrogen canisters",
          "By cooling escaping flame gases through precision flange joints below the methane auto-ignition temperature",
          "By operating entirely without electricity"
        ],
        correctIndex: 2,
        explanation: "FLP enclosures withstand an internal methane explosion and cool escaping hot gases through machined narrow flange gaps so the flame cannot ignite explosive methane in the mine atmosphere."
      },
      {
        id: "q2_6",
        question: "Where must emergency pull-wire stop cords be installed along an underground coal belt conveyor?",
        options: [
          "At the surface electrical substation only",
          "Continuously along the entire accessible length of the conveyor structure",
          "Only at the discharge chute hopper",
          "Inside the underground pithead office"
        ],
        correctIndex: 1,
        explanation: "DGMS Coal Mine Regulations mandate trip pull-wires to run continuously along the full accessible length of conveyors so any worker in danger can immediately trip the emergency stop switch from anywhere."
      },
      {
        id: "q2_7",
        question: "For what minimum duration must a DGMS approved underground refuge chamber sustain trapped miners?",
        options: [
          "2 hours",
          "8 hours",
          "12 hours",
          "Minimum 36 to 48 hours with oxygen, water, and scrubber systems"
        ],
        correctIndex: 3,
        explanation: "Underground refuge chambers are equipped with medical oxygen, CO2 scrubbers, food, and water to sustain trapped personnel for at least 36 to 48 hours during post-disaster rescue."
      }
    ]
  },

  Hindi: {
    courseTitle: "पीपीई एवं कार्यस्थल खतरा निरीक्षण",
    courseSubtitle: "डीजीएमएस (DGMS) अनिवार्य भूमिगत सुरक्षा मानक",
    badgeLabel: "DGMS मानक 2026",
    part1Title: "भाग 1: व्यक्तिगत सुरक्षा उपकरण (PPE)",
    part1Subtitle: "जीवन रक्षक सुरक्षा उपकरण एवं दैनिक शिफ्ट-पूर्व निरीक्षण",
    part2Title: "भाग 2: कार्यस्थल खतरा पहचान एवं रोकथाम",
    part2Subtitle: "भूमिगत छत साउंडिंग, जहरीली गैसें एवं मशीनरी सुरक्षा",
    quiz1Title: "भाग 1 ज्ञान परीक्षा: पीपीई निरीक्षण",
    quiz2Title: "भाग 2 अंतिम मूल्यांकन: खतरा पहचान",
    startQuiz1Btn: "पीपीई क्विज़ शुरू करें",
    startPart2Btn: "भाग 2 जारी रखें: खतरा निरीक्षण",
    startQuiz2Btn: "अंतिम खतरा क्विज़ दें",
    finishCourseBtn: "प्रशिक्षण पूरा करें एवं प्रमाण-पत्र लें",
    nextBtn: "अगला पृष्ठ",
    prevBtn: "पिछला",
    audioNarrateBtn: "ऑडियो सुनें",
    pageIndicator: "पृष्ठ",
    ofText: "का",

    // Part 1: 6 In-Depth Learning Pages (Hindi)
    part1Pages: [
      {
        id: "ppe_helmet",
        tag: "अति-महत्वपूर्ण जीवन सुरक्षा • सिर सुरक्षा",
        title: "1. औद्योगिक माइनिंग हेलमेट एवं कैप लैंप",
        image: "./module_images/ppe_helmet.jpg",
        keyStandard: "DGMS / IS 2925 प्रमाणित मानक",
        description: "भूमिगत कोयला खदानों में छत से गिरते पत्थरों और कम ऊंचाई वाली दीर्घाओं में सिर पर आघात का निरंतर खतरा रहता है। औद्योगिक माइनिंग हेलमेट 5,000 न्यूटन तक के प्रहार को अवशोषित करता है और कैप लैंप को सुरक्षित आधार देता है।",
        bulletPoints: [
          "शेल निरीक्षण: हेलमेट की बाहरी फाइबरग्लास सतह में कोई दरार, छेद या टूटन न हो, इसकी प्रतिदिन जांच करें।",
          "सस्पेंशन हार्नेस: सिर के ऊपरी हिस्से और हेलमेट की ऊपरी परत के बीच अनिवार्य 25-30 मिमी का अंतर होना चाहिए। ढीला हार्नेस आघात को सीधे सिर की हड्डी पर स्थानांतरित करता है।",
          "एडजस्टेबल चिन स्ट्रैप: ठोड़ी की पट्टी को हमेशा कसकर बांधें ताकि ठोकर लगने या झुकने पर हेलमेट सिर से न गिरे।",
          "कॉर्डलेस कैप लैंप: बैटरी की जांच करें कि वह कम से कम 14 घंटे तक निरंतर 4,500+ लक्स का तेज प्रकाश देने में सक्षम हो।"
        ],
        cautionTip: "हेलमेट के अंदर दस्ताने, बीड़ी-सिगरेट या कपड़ा कभी न रखें। सिर और सस्पेंशन के बीच रखी वस्तु आघात सोखने की क्षमता को नष्ट कर देती है।"
      },
      {
        id: "ppe_goggles",
        tag: "दृष्टि सुरक्षा • आंख एवं चेहरा सुरक्षा",
        title: "2. एंटी-फॉग बैलिस्टिक गॉगल्स एवं फेस शील्ड",
        image: "./module_images/ppe_goggles.jpg",
        keyStandard: "EN 166 ग्रेड बी / ANSI Z87.1+",
        description: "कंटीन्यूअस माइनर और न्यूमेटिक ड्रिलिंग के दौरान कोयले के नुकीले कण तीव्र वेग से उड़ते हैं। सामान्य चश्मे इन कणों की टक्कर से तुरंत टूटकर आंखों को गंभीर नुकसान पहुंचा सकते हैं।",
        bulletPoints: [
          "एंटी-फॉग कोटिंग: खदान के भीतर 90% से अधिक नमी होने पर चश्मे पर भाप जमने से रोकने हेतु ड्यूल-पेन वेंटिलेटेड लेंस आवश्यक हैं।",
          "आघात प्रतिरोध: पॉलीकार्बोनेट लेंस को 120 मीटर/सेकंड की गति से आने वाले पत्थर के कणों को बिना टूटे झेलना चाहिए।",
          "सिलिकॉन फेशियल सील: आंखों के चारों ओर धूल-रोधी सील बनाती है, जिससे कोयले की बारीक धूल आंखों में नहीं जा पाती।",
          "फुल फेस शील्ड: रूफ बोल्टिंग एवं ब्लास्टिंग के बाद पत्थरों की छंटाई के दौरान पूरे चेहरे पर फेस शील्ड लगाना अनिवार्य है।"
        ],
        cautionTip: "गंदे दस्तानों से चश्मे का कांच पोंछने से उस पर खरोंच आ जाती है। लेंस को हमेशा साफ पानी से ही धोएं।"
      },
      {
        id: "ppe_respirator",
        tag: "श्वसन सुरक्षा • धूल एवं आत्म-रक्षा",
        title: "3. P100 डस्ट रेस्पिरेटर एवं सेल्फ-रेस्क्यूअर",
        image: "./module_images/ppe_respirator.jpg",
        keyStandard: "DGMS परिपत्र सं. 04 / IS 9473",
        description: "कोयले की बारीक धूल फेफड़ों में जमा होकर न्यूमोकोनिओसिस (ब्लैक लंग) बनाती है। खदान में आग लगने पर कार्बन मोनोऑक्साइड गैस बिना सेल्फ-रेस्क्यूअर के 3 मिनट में जानलेवा साबित होती है।",
        bulletPoints: [
          "ड्यूल P100 फिल्टर: 0.3 माइक्रोन तक के 99.97% धूल कणों को रोकता है। सांस लेने में भारीपन होने पर फिल्टर बदलें।",
          "सील टेस्ट: खदान में प्रवेश से पहले एक्सहेलेशन वॉल्व को हथेली से दबाकर फूंक मारें; किनारों से हवा नहीं निकलनी चाहिए।",
          "फिल्टर लॉक: फिल्टर कार्ट्रिज को घुमाकर तब तक कसें जब तक 'क्लिक' की आवाज न आए।",
          "सेल्फ-रेस्क्यूअर (SCSR): कमर पर हमेशा बांधकर रखें। आपातकाल में 30 सेकंड के भीतर पहनें, यह 60+ मिनट तक शुद्ध ऑक्सीजन प्रदान करता है।"
        ],
        cautionTip: "घनी दाढ़ी रखने पर रेस्पिरेटर की सील चेहरे से सही से नहीं चिपकती, जिससे जहरीली हवा सीधे फेफड़ों में जा सकती है।"
      },
      {
        id: "ppe_boots",
        tag: "पैर सुरक्षा • भारी आघात एवं पंचर रोधी",
        title: "4. स्टील-टो सेफ्टी बूट्स (मेटाटार्सल गार्ड युक्त)",
        image: "./module_images/ppe_boots.jpg",
        keyStandard: "IS 15298 (भाग 2) / DGMS स्वीकृत",
        description: "खदान के कीचड़, नुकीले पत्थरों और भारी रोलिंग टबों के बीच काम करते समय साधारण जूते पंजों को कुचलने से नहीं बचा सकते।",
        bulletPoints: [
          "200 जूल स्टील टो-कैप: 1 मीटर ऊंचाई से गिरने वाले 20 किग्रा तक के भारी पत्थर के सीधे आघात को सहन करता है।",
          "मेटाटार्सल प्रोटेक्टर: पैर के ऊपरी पंजों की हड्डियों को टब और मशीनरी के दबाव से बचाता है।",
          "स्टील मिडसोल: तलवे में स्टील प्लेट नुकीली कीलों या रूफ बोल्ट के आर-पार होने से बचाती है।",
          "एंटी-स्किड ऑयल-रेसिस्टेंट सोल: ढलान वाली पटरियों पर फिसलने से रोकता है और स्थैतिक बिजली (Static spark) का विसर्जन करता है।"
        ],
        cautionTip: "जूते का चमड़ा फटने या स्टील दिखने पर उसे तुरंत बदलें; कटे जूते खदान के अम्लीय पानी को सोखकर करंट का खतरा पैदा करते हैं।"
      },
      {
        id: "ppe_suit",
        tag: "दृश्यता एवं अग्नि रोधी • शरीर आवरण",
        title: "5. हाई-विजिबिलिटी अग्नि-रोधी (FR) ओवरऑल",
        image: "./module_images/module_ppe_hazard_hero.jpg",
        keyStandard: "DGMS / ISO 20471 श्रेणी 3",
        description: "अंधेरी खदान में भारी मशीनों और टब ऑपरेटरों को गहरे कपड़े पहने श्रमिक दिखाई नहीं देते। हाई-विज़ सूट कैप लैंप की रोशनी में 150 मीटर दूर से चमकता है।",
        bulletPoints: [
          "3M रिफ्लेक्टिव स्ट्रिप्स: कंधों, बाहों और पैरों पर 50 मिमी चौड़ी चमकदार पट्टियां 360 डिग्री सुरक्षा प्रदान करती हैं।",
          "अग्नि-रोधी (FR) कपड़ा: 100% उपचारित कॉटन या नोमेक्स कपड़ा मीथेन की लपट लगने पर 2 सेकंड में खुद बुझ जाता है।",
          "एंटी-स्टैटिक कार्बन धागे: घर्षण से चिंगारी बनने से रोकते हैं ताकि मीथेन गैस में विस्फोट न हो।",
          "फिटिंग कफ: आस्तीन और पायदान ढीले नहीं होने चाहिए ताकि वे कन्वेयर बेल्ट या ड्रम में न फंसें।"
        ],
        cautionTip: "खदान में कभी भी नायलॉन या पॉलिएस्टर के कपड़े न पहनें। आग लगने पर ये पिघलकर त्वचा से चिपक जाते हैं।"
      },
      {
        id: "ppe_inspection",
        tag: "नियम एवं प्रक्रिया • शिफ्ट-पूर्व बडी चेक",
        title: "6. शिफ्ट-पूर्व सुरक्षा सूची एवं बडी ऑडिट",
        image: "./module_images/module_ppe_hazard_hero.jpg",
        keyStandard: "DGMS फॉर्म-IV शिफ्ट-पूर्व सुरक्षा ऑडिट",
        description: "खदान में उतरने से पहले प्रत्येक श्रमिक अपने साथी (बडी) के साथ एक-दूसरे के सुरक्षा उपकरणों की 2-मिनट की विस्तृत जांच करता है।",
        bulletPoints: [
          "1. ऊपर से नीचे निरीक्षण: हेलमेट का सस्पेंशन, चिन-स्ट्रैप का तनाव और कैप लैंप के तार की स्थिति जांचें।",
          "2. कैप लैंप लक्स टेस्ट: साथी के हाथ पर 1 मीटर दूरी से रोशनी डालें; रोशनी तेज सफेद होनी चाहिए, पीली या झिलमिलाती नहीं।",
          "3. रेस्पिरेटर सील: चेहरे पर मास्क के किनारों को दबाकर सांस खींचें और छोड़ें।",
          "4. सेल्फ-रेस्क्यूअर सील: सील टूटी न हो और मॉइस्चर इंडिकेटर हरा/साफ हो (गुलाबी होने पर तुरंत बदलें)।",
          "5. बूट्स और लेस: जूतों के फीते सही से बंधे हों ताकि वे पटरियों या स्विच में न उलझें।"
        ],
        cautionTip: "यदि कोई भी उपकरण खराब पाया जाए, तो खदान में प्रवेश न करें और लैंप रूम से नया उपकरण प्राप्त करें।"
      }
    ],

    // परिदृश्य मूल्यांकन (क्विज़ 1 से पहले • 40 अंक)
    scenarioAssessment: {
      id: "scenario_face_entry",
      badge: "डीजीएमएस धारा 22 • व्यावहारिक परिदृश्य (40 अंक)",
      title: "कार्यस्थल प्रवेश पर महत्वपूर्ण पीपीई चयन",
      scenarioText: "आपको बिना सपोर्ट वाली ड्रमी बलुआ पत्थर की छत के नीचे सक्रिय हेडिंग में प्रवेश करने का कार्य सौंपा गया है जहां से पानी टपक रहा है। भारी मशीनरी के कंपन से पूरी तरह अंधेरे में ऊपर से नुकीले पत्थर गिर रहे हैं।",
      questionPrompt: "नीचे दिए गए 4 पीपीई उपकरणों में से उस सबसे महत्वपूर्ण प्राथमिक उपकरण को चुनें जिसे गिरने वाले पत्थरों से बचने और निरंतर रोशनी पाने के लिए सबसे पहले पहनना अनिवार्य है:",
      points: 40,
      options: [
        {
          id: "ppe_helmet",
          title: "माइनिंग हेलमेट और कॉर्डलेस कैप लैंप",
          subtitle: "DGMS / IS 2925 • 25-30mm सस्पेंशन",
          image: "./module_images/ppe_helmet.jpg",
          isCorrect: true,
          tag: "सिर की सुरक्षा और दृष्टि"
        },
        {
          id: "ppe_goggles",
          title: "एंटी-फॉग बैलिस्टिक ड्युअल-पेन गॉगल्स",
          subtitle: "EN 166 ग्रेड B • 120 मी/से प्रभाव",
          image: "./module_images/ppe_goggles.jpg",
          isCorrect: false,
          tag: "आंखों की सुरक्षा"
        },
        {
          id: "ppe_respirator",
          title: "P100 सिलिकॉन डस्ट रेस्पिरेटर और SCSR",
          subtitle: "IS 9473 • 99.97% कण निस्पंदन",
          image: "./module_images/ppe_respirator.jpg",
          isCorrect: false,
          tag: "श्वसन सुरक्षा"
        },
        {
          id: "ppe_boots",
          title: "मेटाटार्सल गार्ड वाले स्टील-टो बूट्स",
          subtitle: "IS 15298 • 200 जूल प्रभाव प्रतिरोधी",
          image: "./module_images/ppe_boots.jpg",
          isCorrect: false,
          tag: "पैर और क्रश सुरक्षा"
        }
      ],
      correctExplanation: "डीजीएमएस मानक IS 2925 के अनुसार, चिन स्ट्रैप बंधा कठोर हेलमेट और 4,500+ लक्स का कैप लैंप किसी भी अंधेरे और छत गिरने के जोखिम वाले फेस में प्रवेश करने की पहली अनिवार्य आवश्यकता है।",
      incorrectExplanation: "यद्यपि यह उपकरण भूमिगत कार्य हेतु आवश्यक है, परंतु ऊपर से गिरते पत्थरों और अंधेरे में सिर की सुरक्षा तथा रोशनी सबसे पहली प्राथमिकता है।"
    },

    // Quiz 1: 7 DGMS MCQs based on Part 1 (Hindi)
    quiz1Questions: [
      {
        id: "q1_1",
        question: "हेलमेट की ऊपरी परत और सिर के बीच कितना अनिवार्य फासला (क्लियरेंस) होना चाहिए?",
        options: [
          "0 मिमी (सीधे सिर पर सटा हुआ)",
          "10 मिमी से 15 मिमी",
          "25 मिमी से 30 मिमी",
          "60 मिमी से अधिक"
        ],
        correctIndex: 2,
        explanation: "25 से 30 मिमी का फासला हार्नेस को खिंचकर पत्थर के आघात की ऊर्जा को सोखने का स्थान देता है, जिससे खोपड़ी पर सीधा झटका नहीं लगता।"
      },
      {
        id: "q1_2",
        question: "भूमिगत कोयला खदानों में नायलॉन या पॉलिएस्टर के सिंथेटिक कपड़े पहनना क्यों सख्त वर्जित है?",
        options: [
          "वे खदान में बहुत ठंडे लगते हैं",
          "आग लगने पर वे पिघलकर सीधे त्वचा से चिपक जाते हैं और गंभीर घाव करते हैं",
          "वे गैस डिटेक्टर को खराब कर देते हैं",
          "वे चलने में बहुत आवाज करते हैं"
        ],
        correctIndex: 1,
        explanation: "सिंथेटिक कपड़ा गर्मी से पिघलकर प्लास्टिक की तरह त्वचा में धंस जाता है। खदान में केवल 100% अग्नि-रोधी सूती कपड़ा ही मान्य है।"
      },
      {
        id: "q1_3",
        question: "सेल्फ-रेस्क्यूअर (SCSR) पर नमी सूचक (Moisture Indicator) का रंग गुलाबी या लाल होने का क्या अर्थ है?",
        options: [
          "उपकरण पूरी तरह चार्ज और सुरक्षित है",
          "उपकरण में नमी घुस चुकी है और यह अब असुरक्षित व खराब हो चुका है",
          "ऑक्सीजन कैंडल गर्म हो चुकी है",
          "बैटरी 50% बची है"
        ],
        correctIndex: 1,
        explanation: "गुलाबी रंग दर्शाता है कि रासायनिक डिब्बे में नमी घुसकर ऑक्सीजन बनाने वाले रसायन को नष्ट कर चुकी है। इसे तुरंत बदला जाना चाहिए।"
      },
      {
        id: "q1_4",
        question: "भूमिगत कॉर्डलेस कैप लैंप के लिए न्यूनतम कितने घंटे लगातार रोशनी और लक्स की आवश्यकता होती है?",
        options: [
          "6 घंटे 1,000 लक्स पर",
          "8 घंटे 2,000 लक्स पर",
          "14 घंटे 4,500+ लक्स पर आपातकालीन रिजर्व के साथ",
          "24 घंटे 500 लक्स पर"
        ],
        correctIndex: 2,
        explanation: "DGMS मानकों के अनुसार कॉर्डलेस एलईडी कैप लैंप को लगातार कम से कम 14 घंटे तक 4,500+ लक्स रोशनी देनी चाहिए ताकि आपात स्थिति में भी रोशनी बनी रहे।"
      },
      {
        id: "q1_5",
        question: "माइनिंग सुरक्षा जूतों में मेटाटार्सल गार्ड (Metatarsal Guard) का मुख्य सुरक्षा कार्य क्या है?",
        options: [
          "पैर की उंगलियों और टखने के बीच की नाजुक हड्डियों को गिरते भारी पत्थरों से बचाना",
          "पैरों को खदान के ठंडे तेजाबी पानी से बचाना",
          "पिंजरे की रस्सियों पर चढ़ने में पकड़ बनाना",
          "स्टैटिक बिजली के झटकों को रोकना"
        ],
        correctIndex: 0,
        explanation: "स्टील टो सिर्फ उंगलियों की रक्षा करता है, जबकि मेटाटार्सल गार्ड पैर के ऊपरी पंजे की हड्डियों को ऊपर से गिरने वाले भारी कोयले व पत्थरों से कुचलने से बचाता है।"
      },
      {
        id: "q1_6",
        question: "भूमिगत खदान में एंटी-फॉग गॉगल्स पर जमी कोयले की धूल को कैसे साफ करना चाहिए?",
        options: [
          "धूल भरे सूती दस्ताने से जोर से रगड़कर",
          "तार वाले ब्रश या खुरपी से खुरचकर",
          "मिट्टी के तेल या डीजल से धोकर",
          "साफ पीने के पानी से धोकर हवा में सूखने देना"
        ],
        correctIndex: 3,
        explanation: "गंदे दस्ताने या कपड़ों से पोंछने पर लेंस पर खरोंच पड़ जाती है और कैप लैंप की रोशनी में चमकने से आंखें चौंधिया जाती हैं। केवल साफ पानी से धोना मान्य है।"
      },
      {
        id: "q1_7",
        question: "P100 सिलिकॉन डस्ट मास्क में चेहरे पर एयरटाइट सील बनने में क्या बाधा डालता है?",
        options: [
          "कान में ईयरप्लग पहनना",
          "कमर पर बैटरी बेल्ट बांधना",
          "सिलिकॉन सील के किनारे दाढ़ी या चेहरे पर बाल होना",
          "हाई-विजिबिलिटी कपड़े पहनना"
        ],
        correctIndex: 2,
        explanation: "दाढ़ी के बाल मास्क और त्वचा के बीच का एयरटाइट संपर्क तोड़ देते हैं, जिससे जानलेवा कोयले की महीन धूल और सिलिका सीधे फेफड़ों में घुस जाती है।"
      }
    ],

    // Part 2: 5 In-Depth Hazard Inspection Pages (Hindi)
    part2Pages: [
      {
        id: "hazard_gas",
        tag: "वायुमंडलीय विषाक्तता • DGMS नियम 140",
        title: "1. भूमिगत जहरीली एवं विस्फोटक गैसों का खतरा",
        image: "./module_images/hazard_gas_ch4.jpg",
        keyStandard: "DGMS मल्टी-गैस सीमा मानक",
        description: "कोयला खदानों में चार मुख्य गैसें पाई जाती हैं: मीथेन (CH4), कार्बन मोनोऑक्साइड (CO), हाइड्रोजन सल्फाइड (H2S), और ऑक्सीजन की कमी (O2)।",
        bulletPoints: [
          "मीथेन (CH4): हवा में 5% से 15% पर विस्फोटक। फेस पर मीथेन 1.25% पहुंचते ही काम रोकना और बिजली काटना अनिवार्य है।",
          "कार्बन मोनोऑक्साइड (CO): कोयले के सुलगने से बनती है। 0.1% सांद्रता पर यह 3 मिनट में जानलेवा साबित होती है।",
          "ऑक्सीजन (O2): सामान्य हवा में 20.9% होती है। 19.0% से कम होने पर व्यक्ति बेहोश होने लगता है।",
          "डिटेक्टर जांच: हर शिफ्ट से पहले 4-गैस डिटेक्टर का बम्प टेस्ट करें और इसे छाती के पास रखें।"
        ],
        cautionTip: "मीथेन हल्की होने के कारण छत के पास जमा होती है, जबकि कार्बन डाइऑक्साइड भारी होने के कारण गड्डों में बैठती है। दोनों जगह जांच करें।"
      },
      {
        id: "hazard_roof",
        tag: "छत स्थिरता • छत एवं साइड गिरने का खतरा",
        title: "2. छत की साउंडिंग एवं दरार पहचान",
        image: "./module_images/hazard_roof_fracture.jpg",
        keyStandard: "सिस्टमैटिक सपोर्ट रूल्स (SSR) / DGMS",
        description: "खदान में होने वाली 40% से अधिक दुर्घटनाएं छत गिरने से होती हैं। नए फेस में जाने से पहले साउंडिंग रॉड से छत की जांच अनिवार्य है।",
        bulletPoints: [
          "साउंडिंग तकनीक: साउंडिंग रॉड से छत पर हल्की चोट करें और हथेली को पास के पत्थर पर सटाकर कंपन महसूस करें।",
          "मजबूत छत की आवाज: धातु जैसी साफ, खनकदार आवाज और हथेली पर शून्य कंपन।",
          "ढीली छत की आवाज: ढोल जैसी खोखली, भारी आवाज और हथेली पर कंपन; यह अलग हो चुकी खतरनाक चट्टान का संकेत है।",
          "तत्काल कार्रवाई: ढीली छत के नीचे कभी न जाएं; तुरंत सपोर्ट लगाएं या पीछे हटें।"
        ],
        cautionTip: "केवल आंखों से देखने पर भरोसा न करें। कोयले की परत के पीछे छिपी दरारें केवल साउंडिंग से ही पकड़ी जा सकती हैं।"
      },
      {
        id: "hazard_conveyor",
        tag: "यांत्रिक खतरा • घूमती मशीनरी एवं बेल्ट",
        title: "3. बेल्ट कन्वेयर एवं निप-पॉइंट से बचाव",
        image: "./module_images/hazard_conveyor_belt.jpg",
        keyStandard: "DGMS सुरक्षा परिपत्र / भारतीय विद्युत नियम",
        description: "भूमिगत ट्रंक कन्वेयर बेल्ट 3.5 मीटर/सेकंड की तेज गति से चलते हैं। घूमते हुए रोलर में हाथ या कपड़ा फंसने पर गंभीर दुर्घटना होती है।",
        bulletPoints: [
          "इमरजेंसी पुल-वायर: कन्वेयर के समानांतर तार खिंचा होता है; आपातकाल में तार खींचते ही बेल्ट तुरंत रुक जाती है।",
          "निप पॉइंट गार्ड: ड्रम और रोलर के चारों ओर मजबूत जालीदार गार्ड का होना कानूनी रूप से अनिवार्य है।",
          "सफाई का नियम: चलती बेल्ट के नीचे से कोयले का मलबा फावड़े से साफ करना सख्त मना है।",
          "पार करने का नियम: कन्वेयर को केवल ऊपर बने फुटब्रिज से ही पार करें; चलती बेल्ट के ऊपर से कूदना वर्जित है।"
        ],
        cautionTip: "ढीले कपड़े या लटकते कैप लैंप के तार कन्वेयर रोलर में खिंचकर जानलेवा जाल बन जाते हैं।"
      },
      {
        id: "hazard_flameproof",
        tag: "विस्फोट रोकथाम • FLP विद्युत उपकरण",
        title: "4. फ्लेमप्रूफ (FLP) बाड़े एवं प्रतिबंधित वस्तुएं",
        image: "./module_images/hazard_gas_ch4.jpg",
        keyStandard: "DGMS / IS/IEC 60079-1 फ्लेमप्रूफ",
        description: "खदान के सभी स्विच और मोटर फ्लेमप्रूफ बक्सों में बंद होने चाहिए ताकि अंदर की स्पार्क बाहर की मीथेन गैस में आग न लगा सके।",
        bulletPoints: [
          "फ्लैंज गैप: FLP बाड़े के जोड़ों का गैप 0.5 मिमी से अधिक नहीं होना चाहिए ताकि गैस ठंडी होकर ही बाहर निकले।",
          "बोल्ट की पूर्णता: बक्से के सभी बोल्ट कड़े होने चाहिए; एक भी बोल्ट गायब होने पर उपकरण गैर-कानूनी और खतरनाक हो जाता है।",
          "बिजली चालू में नो-ओपन: लाइन चालू रहते हुए कभी भी विद्युत टर्मिनल बॉक्स न खोलें; पहले LOTO करें।",
          "प्रतिबंधित सामग्री: माचिस, लाइटर, बीड़ी, सामान्य स्मार्टफोन या गैर-सुरक्षित स्मार्टवॉच खदान में ले जाना दंडनीय अपराध है।"
        ],
        cautionTip: "सामान्य मोबाइल फोन की बैटरी से निकली छोटी चिंगारी पूरी खदान में मीथेन का भीषण विस्फोट करा सकती है।"
      },
      {
        id: "hazard_evacuation",
        tag: "जीवन रक्षा • आपातकालीन निकासी योजना",
        title: "5. रिफ्यूज बे, लाइफलाइन एवं सुरक्षित निकासी",
        image: "./module_images/hazard_water_inrush.jpg",
        keyStandard: "DGMS आपातकालीन तैयारी योजना (EPP)",
        description: "खदान में आग लगने पर घना काला धुआं भर जाता है और रोशनी शून्य हो जाती है। श्रमिकों को लाइफलाइन रस्सी पकड़कर सुरक्षित बाहर निकलना होता है।",
        bulletPoints: [
          "दिशा-सूचक शंकु (Cones): लाइफलाइन रस्सी पर लगे शंकु की नुकीली दिशा ताजी हवा और बाहर निकलने की दिशा बताती है।",
          "रिफ्यूज चैंबर: हवा-रोधी सुरक्षित कमरा जहां 48 घंटे की ऑक्सीजन, पानी और फोन उपलब्ध होता है।",
          "तुरंत SCSR पहनें: धुआं दिखते ही बिना एक सेकंड गंवाए अपना सेल्फ-रेस्क्यूअर पहनें।",
          "नीचे झुककर चलें: जहरीली कार्बन मोनोऑक्साइड गैस छत के पास उठती है; जमीन के पास साफ हवा अधिक देर रहती है।"
        ],
        cautionTip: "धुएं में बात करने के लिए कभी भी रेस्क्यूअर का माउथपीस मुंह से बाहर न निकालें; एक सांस भी जान ले सकती है।"
      }
    ],

    // Quiz 2: 7 DGMS MCQs based on Part 2 (Hindi)
    quiz2Questions: [
      {
        id: "q2_1",
        question: "कोयला फेस पर मीथेन (CH4) की मात्रा कितने प्रतिशत पहुंचते ही तुरंत काम रोककर बिजली काटनी होती है?",
        options: [
          "0.50%",
          "1.25%",
          "5.00%",
          "15.00%"
        ],
        correctIndex: 1,
        explanation: "DGMS नियमों के अनुसार फेस पर मीथेन 1.25% पहुंचते ही विद्युत सप्लाई बंद कर सभी श्रमिकों को सुरक्षित हवा वाले रास्ते में ले जाना अनिवार्य है।"
      },
      {
        id: "q2_2",
        question: "साउंडिंग रॉड से छत ठोकने पर ढोल जैसी खोखली आवाज (Drummy Sound) आने का क्या मतलब है?",
        options: [
          "चट्टान पूरी तरह मजबूत और सुरक्षित है",
          "छत की परत मुख्य चट्टान से अलग होकर ढीली हो चुकी है और गिर सकती है",
          "साउंडिंग रॉड का पीतल खराब है",
          "ताजी हवा आ रही है"
        ],
        correctIndex: 1,
        explanation: "ढोल जैसी खोखली आवाज और हथेली पर कंपन दर्शाता है कि छत का पत्थर अलग हो चुका है और कभी भी ढह सकता है।"
      },
      {
        id: "q2_3",
        question: "आपातकालीन लाइफलाइन रस्सी पर लगे नुकीले शंकु (Cones) अंधेरे में क्या दिशा दिखाते हैं?",
        options: [
          "खदान के गहरे गड्ढे की ओर",
          "शंकु का नुकीला सिरा बाहर ताजी हवा और निकास की दिशा बताता है",
          "वे रोशनी देते हैं",
          "वे सायरन बजाते हैं"
        ],
        correctIndex: 1,
        explanation: "शून्य दृश्यता में हाथ से छूने पर शंकु की नुकीली नोक ताजी हवा और पिट बॉटम से बाहर निकलने की दिशा दिखाती है।"
      },
      {
        id: "q2_4",
        question: "भूमिगत कोयला कार्यस्थल पर कार्बन मोनोऑक्साइड (CO) गैस की अधिकतम सुरक्षित सीमा क्या है?",
        options: [
          "50 PPM (पार्ट्स प्रति मिलियन) से कम",
          "250 PPM",
          "1,000 PPM",
          "5,000 PPM"
        ],
        correctIndex: 0,
        explanation: "कार्बन मोनोऑक्साइड ऑक्सीजन से 210 गुना तेजी से खून में घुलती है। DGMS के अनुसार फेस पर CO 50 PPM से कम होना चाहिए; 1,000 PPM से ऊपर कुछ ही मिनटों में व्यक्ति बेहोश हो जाता है।"
      },
      {
        id: "q2_5",
        question: "फ्लेमप्रूफ (FLP) इलेक्ट्रिकल बॉक्स खदान में गैस विस्फोट को कैसे रोकता है?",
        options: [
          "बॉक्स के अंदर पूरा वैक्यूम बनाकर",
          "अंदर लिक्विड नाइट्रोजन छिड़ककर",
          "मशीनीकृत संकरी दरारों (Flanges) से गुजरने वाली आग को मीथेन के प्रज्वलन तापमान से नीचे ठंडा करके",
          "बिना बिजली के काम करके"
        ],
        correctIndex: 2,
        explanation: "FLP एनक्लोजर अंदर होने वाले स्पार्क की लपटों को अपने संकरे फ्लैंज गैप से गुजार कर ठंडा कर देता है, जिससे बाहर खदान में मौजूद मीथेन में आग नहीं लग पाती।"
      },
      {
        id: "q2_6",
        question: "भूमिगत बेल्ट कन्वेयर पर आपातकालीन पुल-वायर (Pull-Wire) स्टॉप कॉर्ड कहां लगा होना चाहिए?",
        options: [
          "केवल सतह के मुख्य सबस्टेशन पर",
          "कन्वेयर की पूरी लंबाई में निरंतर चलने वाले रास्ते के साथ",
          "केवल कोयला गिराने वाले हॉपर पर",
          "खदान के कार्यालय में"
        ],
        correctIndex: 1,
        explanation: "DGMS नियमों के तहत कन्वेयर बेल्ट के साथ पूरी लंबाई में पुल-वायर होना चाहिए, ताकि किसी भी स्थान पर फंसे व्यक्ति द्वारा तार खींचते ही कन्वेयर तुरंत रुक जाए।"
      },
      {
        id: "q2_7",
        question: "DGMS अनुमोदित भूमिगत रिफ्यूज चैंबर फंसे खनिकों को न्यूनतम कितने समय तक जीवन रक्षक सहायता प्रदान करने योग्य होना चाहिए?",
        options: [
          "2 घंटे",
          "8 घंटे",
          "12 घंटे",
          "न्यूनतम 36 से 48 घंटे (ऑक्सीजन, पानी और कार्बन डाइऑक्साइड स्क्रबर के साथ)"
        ],
        correctIndex: 3,
        explanation: "रिफ्यूज चैंबर में मेडिकल ऑक्सीजन, CO2 स्क्रबर, पानी और भोजन होता है जो आपदा की स्थिति में बचाव दल के पहुंचने तक कम से कम 36 से 48 घंटे तक खनिकों को जीवित रखता है।"
      }
    ]
  },

  Santali: {
    courseTitle: "PPE ᱟᱨ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱵᱤᱯᱚᱫᱽ ᱵᱤᱰᱟᱹᱣ",
    courseSubtitle: "DGMS ᱡᱟᱹᱨᱩᱲ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱟᱱᱚᱠ",
    badgeLabel: "DGMS ᱢᱟᱱᱚᱠ ᱒᱐᱒᱖",
    part1Title: "ᱦᱟᱹᱴᱤᱧ ᱑: ᱟᱯᱱᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱯᱟᱵ (PPE)",
    part1Subtitle: "ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ ᱥᱟᱯᱟᱵ ᱟᱨ ᱥᱤᱯᱷᱴ ᱢᱟᱬᱟᱝ ᱵᱤᱰᱟᱹᱣ",
    part2Title: "ᱦᱟᱹᱴᱤᱧ ᱒: ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ",
    part2Subtitle: "ᱠᱷᱟᱫᱟᱱ ᱪᱷᱟᱛ ᱥᱟᱰᱮ ᱵᱤᱰᱟᱹᱣ, ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱢᱤᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ",
    quiz1Title: "ᱦᱟᱹᱴᱤᱧ ᱑ ᱵᱤᱰᱟᱹᱣ: PPE ᱵᱤᱰᱟᱹᱣ ᱠᱩᱠᱞᱤ",
    quiz2Title: "ᱦᱟᱹᱴᱤᱧ ᱒ ᱢᱩᱪᱟᱹᱫ ᱵᱤᱰᱟᱹᱣ: ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ",
    startQuiz1Btn: "PPE ᱠᱩᱠᱞᱤ ᱮᱛᱚᱦᱚᱵ ᱢᱮ",
    startPart2Btn: "ᱦᱟᱹᱴᱤᱧ ᱒ ᱪᱟᱞᱟᱜ ᱢᱮ: ᱵᱤᱯᱚᱫᱽ ᱵᱤᱰᱟᱹᱣ",
    startQuiz2Btn: "ᱢᱩᱪᱟᱹᱫ ᱵᱤᱯᱚᱫᱽ ᱠᱩᱠᱞᱤ ᱮᱢ ᱢᱮ",
    finishCourseBtn: "ᱯᱩᱨᱟᱹᱣ ᱢᱮ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱦᱟᱛᱟᱣ ᱢᱮ",
    nextBtn: "ᱞᱟᱦᱟ ᱥᱟᱠᱟᱢ",
    prevBtn: "ᱛᱟᱭᱚᱢ ᱥᱟᱠᱟᱢ",
    audioNarrateBtn: "ᱥᱟᱰᱮ ᱟᱸᱡᱚᱢ ᱢᱮ",
    pageIndicator: "ᱥᱟᱠᱟᱢ",
    ofText: "ᱨᱮᱱᱟᱜ",

    // Part 1: 6 In-Depth Learning Pages (Santali)
    part1Pages: [
      {
        id: "ppe_helmet",
        tag: "ᱟᱹᱰᱤ ᱡᱟᱹᱨᱩᱲ ᱡᱤᱣᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ • ᱵᱚᱦᱚᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ",
        title: "᱑. ᱠᱷᱟᱫᱟᱱ ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱠᱮᱯ ᱞᱮᱢᱯ",
        image: "./module_images/ppe_helmet.jpg",
        keyStandard: "DGMS / IS 2925 ᱯᱟᱥ ᱢᱟᱱᱚᱠ",
        description: "ᱜᱟᱹᱦᱤᱨ ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱫᱷᱤᱨᱤ ᱧᱩᱨᱩᱜ ᱟᱨ ᱵᱚᱦᱚᱜ ᱴᱟᱠᱨᱟᱣ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ ᱛᱟᱦᱮᱸᱱᱟ᱾ ᱱᱚᱶᱟ ᱦᱮᱞᱢᱮᱴ ᱕᱐᱐᱐ ᱱᱤᱭᱩᱴᱚᱱ ᱫᱷᱟᱹᱵᱤᱡ ᱫᱷᱟᱠᱟ ᱥᱟᱦᱟᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ ᱟᱨ ᱠᱮᱯ ᱞᱮᱢᱯ ᱥᱟᱵ ᱫᱚᱦᱚᱭᱟ᱾",
        bulletPoints: [
          "ᱵᱟᱦᱨᱮ ᱪᱷᱟᱞ ᱵᱤᱰᱟᱹᱣ: ᱦᱮᱞᱢᱮᱴ ᱨᱮ ᱪᱮᱫ ᱦᱚᱸ ᱯᱷᱟᱴᱟᱣ ᱟᱨᱵᱟᱝ ᱵᱷᱩᱜᱟᱹᱜ ᱵᱟᱹᱱᱩᱜ-ᱟ ᱢᱮᱱᱛᱮ ᱫᱤᱱᱟᱹᱢ ᱧᱮᱞ ᱢᱮ᱾",
          "ᱦᱟᱨᱱᱮᱥ ᱥᱟᱺᱜᱤᱧ: ᱵᱚᱦᱚᱜ ᱪᱮᱛᱟᱱ ᱟᱨ ᱦᱮᱞᱢᱮᱴ ᱛᱟᱞᱟ ᱨᱮ ᱒᱕-᱓᱐ mm ᱡᱟᱭᱜᱟ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱱᱚᱶᱟ ᱛᱮ ᱫᱷᱟᱠᱟ ᱥᱚᱡᱷᱮ ᱵᱚᱦᱚᱜ ᱨᱮ ᱵᱟᱝ ᱵᱟᱡᱟᱣᱜ-ᱟ᱾",
          "ᱪᱤᱱ ᱥᱴᱨᱮᱯ (ᱛᱳᱲᱟ ᱯᱷᱤᱛᱟ): ᱛᱳᱲᱟ ᱞᱟᱛᱟᱨ ᱨᱮ ᱴᱟᱭᱤᱴ ᱛᱚᱞ ᱫᱚᱦᱚᱭ ᱢᱮ ᱡᱮᱢᱚᱱ ᱧᱩᱨ ᱵᱟᱝ ᱦᱩᱭᱩᱜ-ᱟ᱾",
          "ᱠᱮᱯ ᱞᱮᱢᱯ ᱵᱮᱴᱟᱨᱤ: ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱑᱔ ᱴᱟᱲᱟᱝ ᱔᱕᱐᱐+ ᱞᱟᱠᱥ ᱢᱟᱨᱥᱟᱞ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ ᱵᱮᱴᱟᱨᱤ ᱵᱤᱰᱟᱹᱣ ᱢᱮ᱾"
        ],
        cautionTip: "ᱦᱮᱞᱢᱮᱴ ᱵᱷᱤᱛᱤᱨ ᱨᱮ ᱛᱤ-ᱢᱳᱡᱟ, ᱵᱤᱲᱤ, ᱠᱟᱯᱲᱟ ᱟᱞᱚᱢ ᱫᱚᱦᱚᱭᱟ; ᱱᱚᱶᱟ ᱛᱮ ᱦᱮᱞᱢᱮᱴ ᱨᱮᱱᱟᱜ ᱫᱟᱲᱮ ᱠᱚᱢᱚᱜ-ᱟ᱾"
      },
      {
        id: "ppe_goggles",
        tag: "ᱢᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ • ᱢᱮᱫ ᱟᱨ ᱢᱮᱫᱦᱟᱸ ᱨᱩᱠᱷᱤᱭᱟᱹ",
        title: "᱒. ᱫᱷᱩᱸᱫᱽ-ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱚᱥᱢᱟ ᱟᱨ ᱢᱮᱫᱦᱟᱸ ᱠᱷᱚᱞ",
        image: "./module_images/ppe_goggles.jpg",
        keyStandard: "EN 166 ᱜᱽᱨᱮᱰ B / ANSI Z87.1+",
        description: "ᱢᱤᱥᱤᱱ ᱛᱮ ᱠᱩᱭᱞᱟᱹ ᱜᱮᱫ ᱟᱨ ᱵᱷᱩᱜᱟᱹᱜ ᱚᱠᱛᱚ ᱠᱩᱭᱞᱟᱹ ᱴᱩᱠᱨᱟᱹ ᱞᱚᱜᱚᱱ ᱩᱰᱟᱹᱣ ᱠᱟᱛᱮ ᱢᱮᱫ ᱨᱮ ᱵᱟᱡᱟᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾ ᱱᱚᱶᱟ ᱪᱚᱥᱢᱟ ᱢᱮᱫ ᱮ ᱨᱩᱠᱷᱤᱭᱟᱹᱭᱟ᱾",
        bulletPoints: [
          "ᱫᱷᱩᱸᱫᱽ ᱵᱟᱝ ᱡᱟᱣᱨᱟᱜ: ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱤᱨ ᱨᱮ ᱙᱐% ᱦᱚᱭ-ᱫᱟᱜ ᱛᱟᱦᱮᱸᱱ ᱨᱮᱦᱚᱸ ᱱᱚᱶᱟ ᱪᱚᱥᱢᱟ ᱨᱮ ᱫᱷᱩᱸᱫᱽ ᱵᱟᱝ ᱡᱟᱣᱨᱟᱜ-ᱟ᱾",
          "ᱫᱷᱟᱠᱟ ᱥᱟᱦᱟᱣ ᱫᱟᱲᱮ: ᱑᱒᱐ ᱢᱤᱴᱟᱨ/ᱥᱮᱠᱮᱱᱰ ᱛᱮ ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱫᱷᱤᱨᱤ ᱴᱩᱠᱨᱟᱹ ᱨᱮᱦᱚᱸ ᱱᱚᱶᱟ ᱞᱮᱱᱥ ᱵᱟᱝ ᱨᱟᱹᱯᱩᱫᱚᱜ-ᱟ᱾",
          "ᱥᱤᱞᱤᱠᱳᱱ ᱥᱤᱞ: ᱢᱮᱫ ᱟᱲᱮ-ᱯᱟᱥᱮ ᱫᱷᱩᱲᱤ ᱵᱚᱞᱚᱱ ᱠᱷᱚᱱ ᱮ ᱮᱥᱮᱫ ᱫᱚᱦᱚᱭᱟ᱾",
          "ᱯᱩᱨᱟᱹ ᱢᱮᱫᱦᱟᱸ ᱠᱷᱚᱞ: ᱪᱷᱟᱛ ᱨᱮ ᱵᱳᱞᱴ ᱞᱟᱜᱟᱣ ᱚᱠᱛᱚ ᱢᱮᱫᱦᱟᱸ ᱠᱷᱚᱞ ᱦᱚᱨᱚᱜ ᱡᱟᱹᱨᱩᱲ ᱠᱟᱱᱟ᱾"
        ],
        cautionTip: "ᱢᱟᱹᱭᱞᱟᱹ ᱜᱞᱚᱵᱷᱥ ᱛᱮ ᱪᱚᱥᱢᱟ ᱟᱞᱚᱢ ᱡᱚᱫᱟ; ᱱᱤᱨᱚᱲ ᱫᱟᱜ ᱛᱮ ᱥᱟᱯᱷᱟᱭ ᱢᱮ᱾"
      },
      {
        id: "ppe_respirator",
        tag: "ᱥᱟᱦᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ • ᱫᱷᱩᱲᱤ ᱟᱨ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ",
        title: "᱓. P100 ᱫᱷᱩᱲᱤ ᱢᱩᱴᱷᱟᱹᱱ ᱟᱨ ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱣᱟᱨ",
        image: "./module_images/ppe_respirator.jpg",
        keyStandard: "DGMS ᱱᱤᱭᱟᱹᱢ No. 04 / IS 9473",
        description: "ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱛᱮ ᱯᱷᱮᱯᱷᱲᱟ ᱨᱩᱣᱟᱹ (Black Lung) ᱦᱩᱭᱩᱜ-ᱟ᱾ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱚᱠᱛᱚ ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱣᱟᱨ (SCSR) ᱓ ᱢᱤᱱᱤᱴ ᱨᱮ ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾",
        bulletPoints: [
          "P100 ᱯᱷᱤᱞᱴᱚᱨ: ᱐.᱓ ᱢᱟᱭᱠᱨᱚᱱ ᱨᱮᱱᱟᱜ ᱙᱙.᱙᱗% ᱫᱷᱩᱲᱤ ᱮ ᱟᱴᱠᱟᱣᱟ᱾ ᱥᱟᱦᱮᱫ ᱠᱚᱥᱴᱚ ᱞᱮᱠᱷᱟᱱ ᱯᱷᱤᱞᱴᱚᱨ ᱵᱚᱫᱚᱞ ᱢᱮ᱾",
          "ᱥᱤᱞ ᱵᱤᱰᱟᱹᱣ: ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱛᱤ ᱛᱮ ᱵᱷᱟᱞᱵᱷ ᱫᱟᱵᱟᱣ ᱠᱟᱛᱮ ᱥᱟᱦᱮᱫ ᱵᱤᱰᱟᱹᱣ ᱢᱮ; ᱟᱲᱮ ᱛᱮ ᱦᱚᱭ ᱵᱟᱝ ᱚᱰᱚᱠᱚᱜ ᱢᱟ᱾",
          "ᱯᱷᱤᱞᱴᱚᱨ ᱛᱚᱞ: ᱯᱷᱤᱞᱴᱚᱨ ᱵᱮᱥ ᱴᱷᱤᱠ 'ᱠᱞᱤᱠ' ᱥᱟᱰᱮ ᱫᱷᱟᱹᱵᱤᱡ ᱟᱹᱪᱩᱨ ᱠᱟᱛᱮ ᱞᱟᱜᱟᱣ ᱢᱮ᱾",
          "ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱣᱟᱨ (SCSR): ᱰᱟᱸᱰᱟ ᱨᱮ ᱡᱚᱵᱚᱨ ᱛᱚᱞ ᱫᱚᱦᱚᱭ ᱢᱮ᱾ ᱟᱯᱚᱛ ᱚᱠᱛᱚ ᱓᱐ ᱥᱮᱠᱮᱱᱰ ᱨᱮ ᱦᱚᱨᱚᱜ ᱢᱮ; ᱖᱐+ ᱢᱤᱱᱤᱴ ᱚᱠᱥᱤᱡᱮᱱ ᱮᱢᱚᱜ-ᱟ᱾"
        ],
        cautionTip: "ᱢᱮᱫᱦᱟᱸ ᱨᱮ ᱫᱟᱹᱲᱦᱤ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱢᱩᱴᱷᱟᱹᱱ ᱵᱮᱥ ᱵᱟᱝ ᱵᱟᱹᱭᱥᱟᱹᱣᱜ-ᱟ, ᱵᱤᱥ ᱦᱚᱭ ᱵᱷᱤᱛᱤᱨ ᱵᱚᱞᱚ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾"
      },
      {
        id: "ppe_boots",
        tag: "ᱡᱟᱝᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ • ᱢᱮᱬᱦᱮᱫ-ᱴᱳ ᱟᱨ ᱜᱷᱟᱹᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ",
        title: "᱔. ᱢᱮᱬᱦᱮᱫ-ᱴᱳ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱩᱛᱟᱹ (ᱢᱮᱴᱟᱴᱟᱨᱥᱟᱞ ᱥᱟᱶ)",
        image: "./module_images/ppe_boots.jpg",
        keyStandard: "IS 15298 (ᱦᱟᱹᱴᱤᱧ ᱒) / DGMS",
        description: "ᱠᱷᱟᱫᱟᱱ ᱨᱮᱱᱟᱜ ᱦᱟᱥᱟ, ᱞᱚᱥᱚᱫ ᱟᱨ ᱢᱮᱬᱦᱮᱫ ᱴᱚᱵᱽ ᱛᱟᱞᱟ ᱨᱮ ᱡᱟᱝᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱶᱟ ᱡᱩᱛᱟᱹ ᱟᱹᱰᱤ ᱡᱟᱹᱨᱩᱲ ᱠᱟᱱᱟ᱾",
        bulletPoints: [
          "᱒᱐᱐ ᱡᱩᱞ ᱢᱮᱬᱦᱮᱫ ᱴᱳ: ᱑ ᱢᱤᱴᱟᱨ ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱒᱐ ᱠᱤᱞᱳ ᱫᱷᱤᱨᱤ ᱧᱩᱨ ᱨᱮᱦᱚᱸ ᱡᱟᱝᱜᱟ ᱵᱟᱝ ᱪᱮᱯᱮᱫᱚᱜ-ᱟ᱾",
          "ᱢᱮᱴᱟᱴᱟᱨᱥᱟᱞ ᱯᱞᱮᱴ: ᱡᱟᱝᱜᱟ ᱪᱮᱛᱟᱱ ᱦᱟᱰ ᱠᱚ ᱴᱚᱵᱽ ᱟᱨ ᱢᱤᱥᱤᱱ ᱫᱷᱟᱠᱟ ᱠᱷᱚᱱ ᱮ ᱨᱩᱠᱷᱤᱭᱟᱹᱭᱟ᱾",
          "ᱥᱴᱤᱞ ᱞᱟᱛᱟᱨ ᱯᱞᱮᱴ: ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱠᱟᱸᱴᱟ ᱟᱨ ᱨᱩᱯᱷ ᱵᱳᱞᱴ ᱵᱚᱞᱚᱱ ᱠᱷᱚᱱ ᱮ ᱮᱥᱮᱫᱟ᱾",
          "ᱥᱞᱤᱯ-ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱹᱞᱣᱟᱹ: ᱞᱚᱥᱚᱫ ᱨᱮ ᱛᱟᱲᱟᱢ ᱚᱠᱛᱚ ᱞᱤᱥᱤᱨ ᱠᱷᱚᱱ ᱮ ᱵᱟᱧᱪᱟᱣᱟ᱾"
        ],
        cautionTip: "ᱡᱩᱛᱟᱹ ᱨᱮᱱᱟᱜ ᱪᱟᱢᱲᱟ ᱯᱷᱟᱴᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱞᱚᱜᱚᱱ ᱵᱚᱫᱚᱞ ᱢᱮ; ᱫᱟᱜ ᱵᱚᱞᱚ ᱠᱟᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱡᱟᱣ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ ᱛᱟᱦᱮᱸᱱᱟ᱾"
      },
      {
        id: "ppe_suit",
        tag: "ᱧᱮᱞᱚᱜ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ • ᱦᱚᱲᱢᱚ ᱞᱩᱜᱽᱲᱤ",
        title: "᱕. ᱡᱷᱟᱞᱠᱟᱣ ᱥᱮᱸᱜᱮᱞ-ᱨᱩᱠᱷᱤᱭᱟᱹ (FR) ᱥᱩᱴ",
        image: "./module_images/module_ppe_hazard_hero.jpg",
        keyStandard: "DGMS / ISO 20471 ᱛᱷᱟᱨ ᱓",
        description: "ᱧᱩᱛ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱢᱟᱨᱟᱝ ᱜᱟᱹᱰᱤ ᱪᱟᱞᱟᱣᱤᱭᱟᱹ ᱠᱚ ᱧᱩᱛ ᱞᱩᱜᱽᱲᱤ ᱦᱚᱨᱚᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱟᱝ ᱠᱚ ᱧᱮᱞ ᱧᱟᱢ ᱠᱚᱣᱟ᱾ ᱱᱚᱶᱟ ᱥᱩᱴ ᱑᱕᱐ ᱢᱤᱴᱟᱨ ᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱡᱷᱟᱞᱠᱟᱣᱜ-ᱟ᱾",
        bulletPoints: [
          "᱓M ᱡᱷᱟᱞᱠᱟᱣ ᱯᱷᱤᱛᱟ: ᱛᱟᱨᱮᱱ, ᱛᱤ ᱟᱨ ᱡᱟᱝᱜᱟ ᱨᱮ ᱕᱐ mm ᱚᱥᱟᱨ ᱯᱷᱤᱛᱟ ᱓᱖᱐ ᱰᱤᱜᱽᱨᱤ ᱧᱮᱞᱚᱜ-ᱟ᱾",
          "ᱥᱮᱸᱜᱮᱞ-ᱨᱩᱠᱷᱤᱭᱟᱹ (FR) ᱠᱤᱪᱨᱤᱡ: ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱨᱮᱦᱚᱸ ᱒ ᱥᱮᱠᱮᱱᱰ ᱨᱮ ᱟᱡ ᱛᱮᱜᱮ ᱤᱬᱤᱡᱚᱜ-ᱟ᱾",
          "ᱮᱱᱴᱤ-ᱥᱴᱮᱴᱤᱠ ᱫᱟᱲᱮ: ᱜᱷᱟᱥᱟᱣ ᱛᱮ ᱥᱯᱟᱨᱠ ᱵᱟᱝ ᱵᱮᱱᱟᱣᱜ-ᱟ, ᱜᱮᱥ ᱵᱟᱝ ᱪᱚᱢᱠᱟᱣᱜ-ᱟ᱾",
          "ᱴᱟᱭᱤᱴ ᱠᱟᱯᱷ: ᱦᱟᱛᱟ ᱟᱨ ᱡᱟᱝᱜᱟ ᱨᱮ ᱠᱤᱪᱨᱤᱡ ᱵᱟᱝ ᱡᱷᱩᱞᱩᱜ ᱢᱟ, ᱡᱮᱢᱚᱱ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱨᱮ ᱵᱟᱝ ᱯᱷᱟᱥᱟᱣᱜ-ᱟ᱾"
        ],
        cautionTip: "ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱯᱚᱞᱤᱭᱮᱥᱴᱚᱨ ᱟᱨ ᱱᱟᱭᱞᱚᱱ ᱠᱤᱪᱨᱤᱡ ᱟᱞᱚᱢ ᱦᱚᱨᱚᱜᱟ; ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱱᱚᱶᱟ ᱦᱚᱲᱢᱚ ᱨᱮ ᱞᱟᱴᱷᱟᱜ-ᱟ᱾"
      },
      {
        id: "ppe_inspection",
        tag: "ᱱᱤᱭᱟᱹᱢ ᱦᱚᱨᱟ • ᱥᱤᱯᱷᱴ ᱢᱟᱬᱟᱝ ᱜᱟᱛᱮ ᱵᱤᱰᱟᱹᱣ",
        title: "᱖. ᱥᱤᱯᱷᱴ ᱢᱟᱬᱟᱝ ᱥᱟᱯᱟᱵ ᱵᱤᱰᱟᱹᱣ ᱟᱨ ᱵᱟᱹᱰᱤ ᱪᱮᱠ",
        image: "./module_images/module_ppe_hazard_hero.jpg",
        keyStandard: "DGMS ᱯᱷᱚᱨᱢ-IV ᱥᱤᱯᱷᱴ ᱢᱟᱬᱟᱝ ᱵᱤᱰᱟᱹᱣ",
        description: "ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱵᱟᱨᱭᱟ ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱢᱤᱫ ᱟᱨᱢᱤᱫᱟᱜ ᱥᱟᱯᱟᱵ ᱒ ᱢᱤᱱᱤᱴ ᱵᱮᱥ ᱴᱷᱤᱠ ᱠᱤᱱ ᱵᱤᱰᱟᱹᱣᱟ᱾",
        bulletPoints: [
          "᱑. ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱞᱟᱛᱟᱨ ᱧᱮᱞ: ᱦᱮᱞᱢᱮᱴ ᱦᱟᱨᱱᱮᱥ, ᱪᱤᱱ-ᱥᱴᱨᱮᱯ ᱟᱨ ᱞᱮᱢᱯ ᱛᱟᱨ ᱵᱮᱥ ᱢᱮᱱᱟᱜ-ᱟ ᱥᱮ ᱵᱟᱝ᱾",
          "᱒. ᱞᱮᱢᱯ ᱢᱟᱨᱥᱟᱞ ᱵᱤᱰᱟᱹᱣ: ᱑ ᱢᱤᱴᱟᱨ ᱠᱷᱚᱱ ᱛᱤ ᱨᱮ ᱢᱟᱨᱥᱟᱞ ᱮᱢ ᱢᱮ; ᱢᱟᱨᱥᱟᱞ ᱯᱩᱸᱰ ᱟᱨ ᱛᱮᱡᱽ ᱛᱟᱦᱮᱸᱱ ᱢᱟ᱾",
          "᱓. ᱢᱩᱴᱷᱟᱹᱱ ᱥᱤᱞ ᱵᱤᱰᱟᱹᱣ: ᱢᱮᱫᱦᱟᱸ ᱨᱮ ᱢᱟᱥᱠ ᱵᱟᱹᱭᱥᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱟᱦᱮᱫ ᱵᱤᱰᱟᱹᱣ ᱢᱮ᱾",
          "᱔. SCSR ᱥᱤᱞ: ᱥᱤᱞ ᱛᱚᱯᱟᱜ ᱵᱟᱹᱱᱩᱜ ᱢᱟ ᱟᱨ ᱪᱤᱱᱦᱟᱹ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱛᱟᱦᱮᱸᱱ ᱢᱟ (ᱜᱩᱞᱟᱵᱤ ᱠᱷᱟᱱ ᱵᱚᱫᱚᱞ ᱢᱮ)᱾",
          "᱕. ᱡᱩᱛᱟᱹ ᱯᱷᱤᱛᱟ: ᱡᱩᱛᱟᱹ ᱯᱷᱤᱛᱟ ᱴᱟᱭᱤᱴ ᱛᱚᱞ ᱛᱟᱦᱮᱸᱱ ᱢᱟ ᱡᱮᱢᱚᱱ ᱴᱨᱮᱠ ᱨᱮ ᱵᱟᱝ ᱟᱴᱠᱟᱣᱜ-ᱟ᱾"
        ],
        cautionTip: "ᱡᱩᱫᱤ ᱡᱟᱦᱟᱸᱱ ᱥᱟᱯᱟᱵ ᱠᱷᱟᱨᱟᱯ ᱜᱮᱭᱟ, ᱠᱷᱟᱫᱟᱱ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ; ᱞᱮᱢᱯ ᱚᱲᱟᱜ ᱠᱷᱚᱱ ᱱᱟᱣᱟ ᱥᱟᱯᱟᱵ ᱟᱹᱜᱩᱭ ᱢᱮ᱾"
      }
    ],

    // ᱜᱷᱚᱴᱚᱱ ᱵᱤᱰᱟᱹᱣ (ᱠᱩᱠᱞᱤ ᱑ ᱢᱟᱬᱟᱝ • ᱔᱐ ᱱᱚᱢᱵᱚᱨ)
    scenarioAssessment: {
      id: "scenario_face_entry",
      badge: "DGMS ᱫᱷᱟᱨᱟ ᱒᱒ • ᱵᱮᱵᱷᱟᱨᱤᱭᱟᱹ ᱜᱷᱚᱴᱚᱱ (᱔᱐ ᱱᱚᱢᱵᱚᱨ)",
      title: "ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱵᱚᱞᱚᱱ ᱢᱩᱬᱩᱛ PPE ᱵᱟᱪᱷᱟᱣ",
      scenarioText: "ᱟᱢ ᱫᱚ ᱵᱤᱱ-ᱴᱮᱠᱟᱣ ᱫᱷᱤᱨᱤ ᱪᱷᱟᱛ ᱞᱟᱛᱟᱨ ᱨᱮ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱵᱚᱞᱚᱱ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ ᱮᱢ ᱟᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱫᱟᱜ ᱡᱚᱨᱚᱜ ᱠᱟᱱᱟ ᱟᱨ ᱢᱮᱥᱤᱱ ᱞᱟᱲᱟᱣ ᱛᱮ ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱫᱷᱤᱨᱤ ᱧᱩᱨᱩᱜ ᱠᱟᱱᱟ ᱟᱨ ᱧᱩᱛ ᱢᱮᱱᱟᱜ-ᱟ᱾",
      questionPrompt: "ᱞᱟᱛᱟᱨ ᱨᱮ ᱮᱢ ᱟᱠᱟᱱ ᱔ ᱜᱚᱴᱟᱝ PPE ᱢᱩᱫᱽ ᱨᱮ ᱚᱠᱟ ᱢᱩᱬᱩᱛ ᱡᱤᱱᱤᱥ ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱧᱩᱨᱩᱜ ᱫᱷᱤᱨᱤ ᱟᱨ ᱢᱟᱨᱥᱟᱞ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱯᱩᱭᱞᱩ ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?",
      points: 40,
      options: [
        {
          id: "ppe_helmet",
          title: "ᱠᱷᱟᱫᱟᱱ ᱴᱩᱯᱨᱤ (Helmet) ᱟᱨ ᱠᱮᱯ ᱞᱮᱢᱯ",
          subtitle: "DGMS / IS ᱒᱙᱒᱕ • ᱒᱕-᱓᱐mm ᱥᱟᱦᱟ",
          image: "./module_images/ppe_helmet.jpg",
          isCorrect: true,
          tag: "ᱵᱚᱦᱚᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱢᱟᱨᱥᱟᱞ"
        },
        {
          id: "ppe_goggles",
          title: "ᱫᱷᱩᱸᱫᱽ-ᱵᱟᱹᱱᱩᱜ ᱵᱮᱞᱤᱥᱴᱤᱠ ᱜᱚᱜᱚᱞᱥ",
          subtitle: "EN ᱑᱖᱖ Grade B • ᱑᱒᱐ m/s ᱨᱩᱠᱷᱤᱭᱟᱹ",
          image: "./module_images/ppe_goggles.jpg",
          isCorrect: false,
          tag: "ᱢᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ"
        },
        {
          id: "ppe_respirator",
          title: "P100 ᱥᱤᱞᱤᱠᱚᱱ ᱨᱮᱥᱯᱤᱨᱮᱴᱚᱨ ᱟᱨ SCSR",
          subtitle: "IS ᱙᱔᱗᱓ • ᱙᱙.᱙᱗% ᱫᱷᱩᱲᱤ ଛᱟᱠᱟᱣ",
          image: "./module_images/ppe_respirator.jpg",
          isCorrect: false,
          tag: "ᱥᱟᱦᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ"
        },
        {
          id: "ppe_boots",
          title: "ᱢᱮᱴᱟᱴᱟᱨᱥᱟᱞ ᱜᱟᱨᱰ ᱥᱴᱤᱞ-ᱴᱳ ᱵᱩᱴ",
          subtitle: "IS ᱑᱕᱒᱙᱘ • ᱒᱐᱐J ᱨᱩᱠᱷᱤᱭᱟᱹ",
          image: "./module_images/ppe_boots.jpg",
          isCorrect: false,
          tag: "ᱡᱟᱝᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ"
        }
      ],
      correctExplanation: "DGMS IS ᱒᱙᱒᱕ ᱞᱮᱠᱟᱛᱮ, ᱵᱚᱦᱚᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱧᱩᱛ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱔,᱕᱐᱐+ ᱞᱟᱠᱥ ᱨᱮᱱᱟᱜ ᱠᱮᱯ ᱞᱮᱢᱯ ᱯᱩᱭᱞᱩ ᱦᱚᱨᱚᱜ ᱫᱚ ᱵᱟᱭ ᱵᱟᱹᱜᱤ ᱜᱟᱱᱚᱜ-ᱟ᱾",
      incorrectExplanation: "ᱱᱚᱣᱟ ᱦᱚᱸ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱱᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱧᱩᱨᱩᱜ ᱫᱷᱤᱨᱤ ᱠᱷᱚᱱ ᱵᱚᱦᱚᱜ ᱵᱟᱧᱪᱟᱣ ᱟᱨ ᱢᱟᱨᱥᱟᱞ ᱜᱮ ᱯᱩᱭᱞᱩ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ᱾"
    },

    // Quiz 1: 3 MCQs based on Part 1 (Santali)
    quiz1Questions: [
      {
        id: "q1_1",
        question: "ᱦᱮᱞᱢᱮᱴ ᱪᱮᱛᱟᱱ ᱪᱷᱟᱞ ᱟᱨ ᱵᱚᱦᱚᱜ ᱛᱟᱞᱟ ᱨᱮ ᱛᱤᱱᱟᱹᱜ ᱡᱟᱭᱜᱟ (Clearance) ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ?",
        options: [
          "0 mm (ᱥᱚᱡᱷᱮ ᱵᱚᱦᱚᱜ ᱨᱮ ᱞᱟᱴᱷᱟ)",
          "10 mm ᱠᱷᱚᱱ 15 mm",
          "25 mm ᱠᱷᱚᱱ 30 mm",
          "60 mm ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ"
        ],
        correctIndex: 2,
        explanation: "᱒᱕ ᱠᱷᱚᱱ ᱓᱐ mm ᱡᱟᱭᱜᱟ ᱛᱟᱦᱮᱸᱱ ᱞᱮᱠᱷᱟᱱ ᱦᱟᱨᱱᱮᱥ ᱫᱷᱟᱠᱟ ᱮ ᱥᱟᱦᱟᱣᱟ ᱟᱨ ᱵᱚᱦᱚᱜ ᱨᱮ ᱥᱚᱡᱷᱮ ᱪᱳᱴ ᱵᱟᱝ ᱵᱟᱡᱟᱣᱜ-ᱟ᱾"
      },
      {
        id: "q1_2",
        question: "ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱯᱚᱞᱤᱭᱮᱥᱴᱚᱨ ᱟᱨ ᱱᱟᱭᱞᱚᱱ ᱠᱤᱪᱨᱤᱡ ᱦᱚᱨᱚᱜ ᱪᱮᱫᱟᱜ ᱢᱟᱱᱟ ᱜᱮᱭᱟ?",
        options: [
          "ᱱᱚᱶᱟ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱨᱮᱭᱟᱲ ᱜᱮᱭᱟ",
          "ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱱᱚᱶᱟ ᱞᱤᱧᱡᱤ ᱠᱟᱛᱮ ᱦᱚᱲᱢᱚ ᱨᱮ ᱞᱟᱴᱷᱟᱜ-ᱟ ᱟᱨ ᱜᱷᱟᱹᱞ ᱦᱩᱭᱩᱜ-ᱟ",
          "ᱱᱚᱶᱟ ᱛᱮ ᱜᱮᱥ ᱢᱤᱥᱤᱱ ᱠᱷᱟᱨᱟᱯᱚᱜ-ᱟ",
          "ᱱᱚᱶᱟ ᱛᱮ ᱥᱟᱰᱮ ᱦᱩᱭᱩᱜ-ᱟ"
        ],
        correctIndex: 1,
        explanation: "ᱥᱤᱱᱛᱷᱮᱴᱤᱠ ᱠᱤᱪᱨᱤᱡ ᱞᱚᱞᱚ ᱛᱮ ᱯᱞᱟᱥᱴᱤᱠ ᱞᱮᱠᱟ ᱞᱤᱧᱡᱤ ᱠᱟᱛᱮ ᱦᱚᱲᱢᱚ ᱨᱮ ᱞᱟᱴᱷᱟᱜ-ᱟ᱾ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱥᱩᱢᱩᱝ ᱥᱮᱸᱜᱮᱞ-ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱩᱞᱟᱹᱢ ᱠᱤᱪᱨᱤᱡ ᱜᱮ ᱪᱟᱞᱟᱜ-ᱟ᱾"
      },
      {
        id: "q1_3",
        question: "ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱣᱟᱨ (SCSR) ᱨᱮ ᱫᱟᱜ ᱪᱤᱱᱦᱟᱹ (Moisture Indicator) ᱜᱩᱞᱟᱵᱤ/ᱟᱨᱟᱜ ᱦᱩᱭᱩᱜ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?",
        options: [
          "ᱥᱟᱯᱟᱵ ᱯᱩᱨᱟᱹ ᱵᱷᱟᱹᱜᱤ ᱢᱮᱱᱟᱜ-ᱟ",
          "ᱥᱟᱯᱟᱵ ᱵᱷᱤᱛᱤᱨ ᱨᱮ ᱫᱟᱜ ᱵᱚᱞᱚ ᱟᱠᱟᱱᱟ, ᱱᱚᱶᱟ ᱠᱷᱟᱨᱟᱯ ᱜᱮᱭᱟ",
          "ᱚᱠᱥᱤᱡᱮᱱ ᱞᱚᱞᱚ ᱟᱠᱟᱱᱟ",
          "ᱵᱮᱴᱟᱨᱤ ᱕᱐% ᱢᱮᱱᱟᱜ-ᱟ"
        ],
        correctIndex: 1,
        explanation: "ᱜᱩᱞᱟᱵᱤ ᱨᱚᱝ ᱩᱫᱩᱜᱟ ᱡᱮ ᱦᱚᱭ-ᱫᱟᱜ ᱵᱚᱞᱚ ᱠᱟᱛᱮ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱮᱢᱤᱠᱟᱞ ᱮ ᱠᱷᱟᱨᱟᱯ ᱟᱠᱟᱫ-ᱟ᱾ ᱱᱚᱶᱟ ᱫᱚ ᱞᱚᱜᱚᱱ ᱵᱚᱫᱚᱞ ᱦᱩᱭᱩᱜ-ᱟ᱾"
      },
      {
        id: "q1_4",
        question: "ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱤᱨ ᱠᱚᱨᱰᱞᱮᱥ ᱠᱮᱯ ᱞᱮᱢᱯ ᱞᱟᱹᱜᱤᱫ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱛᱤᱱᱟᱹᱜ ᱴᱟᱲᱟᱝ ᱞᱮᱛᱟᱲ ᱢᱟᱨᱥᱟᱞ ᱟᱨ ᱞᱟᱠᱥ (Lux) ᱡᱟᱹᱨᱩᱲ ᱠᱟᱱᱟ?",
        options: [
          "᱖ ᱴᱟᱲᱟᱝ ᱑,᱐᱐᱐ ᱞᱟᱠᱥ ᱨᱮ",
          "᱘ ᱴᱟᱲᱟᱝ ᱒,᱐᱐᱐ ᱞᱟᱠᱥ ᱨᱮ",
          "᱑᱔ ᱴᱟᱲᱟᱝ ᱔,᱕᱐᱐+ ᱞᱟᱠᱥ ᱨᱮ ᱟᱯᱚᱛ ᱨᱤᱡᱚᱨᱵᱽ ᱥᱟᱶ",
          "᱒᱔ ᱴᱟᱲᱟᱝ ᱕᱐᱐ ᱞᱟᱠᱥ ᱨᱮ"
        ],
        correctIndex: 2,
        explanation: "DGMS ᱢᱟᱱᱚᱠ ᱞᱮᱠᱟᱛᱮ ᱠᱚᱨᱰᱞᱮᱥ ᱮᱞᱹᱤᱹᱰᱤ ᱠᱮᱯ ᱞᱮᱢᱯ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱑᱔ ᱴᱟᱲᱟᱝ ᱔,᱕᱐᱐+ ᱞᱟᱠᱥ ᱢᱟᱨᱥᱟᱞ ᱮᱢᱚᱜ ᱞᱟᱹᱠᱛᱤ ᱡᱮᱢᱚᱱ ᱟᱯᱚᱛ ᱚᱠᱛᱚ ᱦᱚᱸ ᱢᱟᱨᱥᱟᱞ ᱛᱟᱦᱮᱸᱱ ᱢᱟ᱾"
      },
      {
        id: "q1_5",
        question: "ᱠᱷᱟᱫᱟᱱ ᱵᱩᱴ ᱨᱮ ᱢᱮᱴᱟᱴᱟᱨᱥᱟᱞ ᱜᱟᱨᱰ (Metatarsal Guard) ᱨᱮᱱᱟᱜ ᱢᱩᱬ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤ ᱪᱮᱫ?",
        options: [
          "ᱡᱟᱸᱜᱟ ᱠᱟᱹᱴᱩᱵ ᱟᱨ ᱜᱚᱸᱴᱷᱮ ᱛᱟᱞᱟ ᱨᱮᱱᱟᱜ ᱞᱤᱪᱟᱹᱲ ᱡᱟᱝ ᱠᱚ ᱧᱩᱨᱩᱜ ᱫᱷᱤᱨᱤ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ",
          "ᱡᱟᱸᱜᱟ ᱠᱷᱟᱫᱟᱱ ᱨᱮᱱᱟᱜ ᱨᱮᱭᱟᱲ ᱮᱥᱤᱰ ᱫᱟᱜ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ",
          "ᱠᱮᱡᱽ ᱨᱟᱹᱥᱤ ᱨᱮ ᱫᱮᱡᱚᱜ ᱨᱮ ᱜᱚᱲᱚ",
          "ᱥᱴᱮᱴᱤᱠ ᱵᱤᱡᱽᱞᱤ ᱥᱯᱟᱨᱠ ᱟᱴᱠᱟᱣ"
        ],
        correctIndex: 0,
        explanation: "ᱥᱴᱤᱞ ᱴᱳ ᱥᱩᱢᱩᱝ ᱠᱟᱹᱴᱩᱵ ᱮ ᱵᱟᱧᱪᱟᱣᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱢᱮᱴᱟᱴᱟᱨᱥᱟᱞ ᱜᱟᱨᱰ ᱫᱚ ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱧᱩᱨᱩᱜ ᱦᱟᱢᱟᱞ ᱫᱷᱤᱨᱤ ᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱠᱷᱚᱱ ᱯᱟᱧᱡᱟ ᱪᱮᱛᱟᱱ ᱡᱟᱝ ᱮ ᱨᱩᱠᱷᱤᱭᱟᱹᱭᱟ᱾"
      },
      {
        id: "q1_6",
        question: "ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱤᱨ ᱨᱮ ᱮᱱᱴᱤ-ᱯᱷᱚᱜᱽ ᱜᱚᱜᱚᱞᱥ ᱨᱮ ᱞᱟᱴᱷᱟ ᱟᱠᱟᱱ ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱪᱮᱫ ᱞᱮᱠᱟ ᱥᱟᱯᱷᱟ ᱞᱟᱹᱠᱛᱤᱭᱟ?",
        options: [
          "ᱫᱷᱩᱲᱤ ᱛᱮ ᱯᱮᱨᱮᱡ ᱛᱩᱞᱟᱹᱢ ᱢᱳᱡᱟ ᱛᱮ ᱡᱚᱨ ᱛᱮ ᱡᱚᱫ ᱠᱟᱛᱮ",
          "ᱢᱮᱬᱦᱮᱫ ᱵᱨᱟᱥ ᱟᱨᱵᱟᱝ ᱠᱷᱩᱨᱯᱤ ᱛᱮ ᱠᱷᱟᱹᱨᱪᱟᱹᱣ ᱠᱟᱛᱮ",
          "ᱠᱮᱨᱚᱥᱤᱱ ᱟᱨᱵᱟᱝ ᱰᱤᱡᱮᱞ ᱛᱮ ᱟᱹᱨᱩᱵ ᱠᱟᱛᱮ",
          "ᱥᱟᱯᱷᱟ ᱧᱩ ᱫᱟᱜ ᱛᱮ ᱟᱹᱨᱩᱵ ᱠᱟᱛᱮ ᱦᱚᱭ ᱨᱮ ᱨᱚᱦᱚᱲ ᱦᱚᱪᱚ"
        ],
        correctIndex: 3,
        explanation: "ᱢᱟᱹᱭᱞᱟᱹ ᱠᱤᱪᱨᱤᱡ ᱛᱮ ᱡᱚᱫ ᱞᱮᱠᱷᱟᱱ ᱞᱮᱱᱥ ᱨᱮ ᱫᱟᱜ ᱯᱟᱲᱟᱣᱜ-ᱟ ᱟᱨ ᱞᱮᱢᱯ ᱢᱟᱨᱥᱟᱞ ᱨᱮ ᱢᱮᱫ ᱪᱷᱟᱸᱪᱚᱜ-ᱟ᱾ ᱥᱩᱢᱩᱝ ᱥᱟᱯᱷᱟ ᱫᱟᱜ ᱛᱮ ᱟᱹᱨᱩᱵ ᱜᱮ ᱴᱷᱤᱠᱟᱹ᱾"
      },
      {
        id: "q1_7",
        question: "P100 ᱥᱤᱞᱤᱠᱳᱱ ᱰᱟᱥᱴ ᱢᱟᱥᱠ ᱨᱮ ᱢᱮᱫᱦᱟᱸ ᱨᱮ ᱦᱚᱭ-ᱮᱥᱮᱫ ᱥᱤᱞ (Seal) ᱵᱮᱱᱟᱣ ᱨᱮ ᱪᱮᱫ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱤᱨᱡᱟᱹᱣᱟ?",
        options: [
          "ᱞᱩᱛᱩᱨ ᱨᱮ ᱤᱭᱟᱹᱨᱯᱞᱟᱜᱽ ᱦᱚᱨᱚᱜ",
          "ᱰᱟᱸᱰᱟ ᱨᱮ ᱵᱮᱴᱟᱨᱤ ᱵᱮᱞᱴ ᱛᱚᱞ",
          "ᱥᱤᱞᱤᱠᱳᱱ ᱥᱤᱞ ᱫᱷᱟᱨᱮ ᱨᱮ ᱫᱟᱹᱲᱦᱤ ᱥᱮ ᱩᱵ ᱛᱟᱦᱮᱸᱱ",
          "ᱦᱟᱭ-ᱵᱷᱤᱡᱤᱵᱤᱞᱤᱴᱤ ᱠᱤᱪᱨᱤᱡ ᱦᱚᱨᱚᱜ"
        ],
        correctIndex: 2,
        explanation: "ᱫᱟᱹᱲᱦᱤ ᱨᱮᱱᱟᱜ ᱩᱵ ᱢᱟᱥᱠ ᱟᱨ ᱪᱟᱢᱲᱟ ᱛᱟᱞᱟ ᱨᱮᱱᱟᱜ ᱦᱚᱭ-ᱮᱥᱮᱫ ᱡᱚᱲ ᱮ ᱨᱟᱹᱯᱩᱫᱟ, ᱡᱟᱦᱟᱸ ᱛᱮ ᱵᱤᱥ ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱥᱚᱡᱷᱮ ᱯᱷᱮᱯᱷᱲᱟ ᱨᱮ ᱵᱚᱞᱚᱱᱟ᱾"
      }
    ],

    // Part 2: 5 In-Depth Hazard Inspection Pages (Santali)
    part2Pages: [
      {
        id: "hazard_gas",
        tag: "ᱦᱚᱭ ᱵᱤᱥ • DGMS ᱱᱤᱭᱟᱹᱢ ᱑᱔᱐",
        title: "᱑. ᱜᱟᱹᱦᱤᱨ ᱠᱷᱟᱫᱟᱱ ᱵᱤᱥ ᱟᱨ ᱯᱷᱩᱴᱟᱹᱣ ᱜᱮᱥ ᱵᱚᱛᱚᱨ",
        image: "./module_images/hazard_gas_ch4.jpg",
        keyStandard: "DGMS ᱯᱩᱱ-ᱜᱮᱥ ᱥᱤᱢᱟᱹ ᱢᱟᱱᱚᱠ",
        description: "ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱯᱩᱱᱭᱟᱹ ᱵᱤᱯᱚᱫᱽ ᱜᱮᱥ ᱛᱟᱦᱮᱸᱱᱟ: ᱢᱤᱛᱷᱮᱱ (CH4), ᱠᱟᱨᱵᱚᱱ ᱢᱚᱱᱳᱠᱥᱟᱭᱤᱰ (CO), ᱦᱟᱭᱰᱨᱳᱡᱮᱱ ᱥᱟᱞᱯᱷᱟᱭᱤᱰ (H2S), ᱟᱨ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢᱚᱜ (O2)᱾",
        bulletPoints: [
          "ᱢᱤᱛᱷᱮᱱ (CH4): ᱦᱚᱭ ᱨᱮ ᱕% ᱠᱷᱚᱱ ᱑᱕% ᱨᱮ ᱯᱷᱩᱴᱟᱹᱣᱜ-ᱟ᱾ ᱠᱟᱹᱢᱤ ᱯᱷᱮᱥ ᱨᱮ ᱑.᱒᱕% ᱦᱩᱭ ᱞᱮᱱᱠᱷᱟᱱ ᱠᱟᱹᱢᱤ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱡᱟᱹᱨᱩᱲ ᱠᱟᱱᱟ᱾",
          "ᱠᱟᱨᱵᱚᱱ ᱢᱚᱱᱳᱠᱥᱟᱭᱤᱰ (CO): ᱠᱩᱭᱞᱟᱹ ᱡᱩᱞᱩᱜ ᱠᱷᱚᱱ ᱵᱮᱱᱟᱣᱜ-ᱟ᱾ ᱐.᱑% ᱨᱮ ᱓ ᱢᱤᱱᱤᱴ ᱨᱮ ᱦᱚᱲ ᱮ ᱜᱚᱡ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾",
          "ᱚᱠᱥᱤᱡᱮᱱ (O2): ᱱᱤᱨᱚᱲ ᱦᱚᱭ ᱨᱮ ᱒᱐.᱙% ᱛᱟᱦᱮᱸᱱᱟ᱾ ᱑᱙.᱐% ᱠᱷᱚᱱ ᱠᱚᱢ ᱞᱮᱠᱷᱟᱱ ᱦᱚᱲ ᱵᱮᱦᱚᱸᱥᱚᱜ-ᱟ᱾",
          "ᱜᱮᱥ ᱢᱤᱥᱤᱱ ᱵᱤᱰᱟᱹᱣ: ᱥᱤᱯᱷᱴ ᱢᱟᱬᱟᱝ ᱔-ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱵᱤᱰᱟᱹᱣ ᱢᱮ ᱟᱨ ᱠᱚᱲᱟᱢ ᱴᱷᱮᱱ ᱨᱮ ᱫᱚᱦᱚᱭ ᱢᱮ᱾"
        ],
        cautionTip: "ᱢᱤᱛᱷᱮᱱ ᱦᱟᱞᱠᱟ ᱜᱮᱭᱟ ᱚᱱᱟᱛᱮ ᱪᱷᱟᱛ ᱨᱮ ᱡᱟᱣᱨᱟᱜ-ᱟ, ᱟᱨ ᱠᱟᱨᱵᱚᱱ ᱰᱟᱭᱚᱠᱥᱟᱭᱤᱰ ᱦᱟᱢᱟᱞ ᱜᱮᱭᱟ ᱚᱱᱟᱛᱮ ᱜᱟᱰᱦᱟ ᱨᱮ ᱵᱟᱹᱭᱥᱟᱹᱣᱜ-ᱟ᱾"
      },
      {
        id: "hazard_roof",
        tag: "ᱪᱷᱟᱛ ᱨᱩᱠᱷᱤᱭᱟᱹ • ᱫᱷᱤᱨᱤ ᱧᱩᱨ ᱵᱚᱛᱚᱨ",
        title: "᱒. ᱠᱷᱟᱫᱟᱱ ᱪᱷᱟᱛ ᱥᱟᱰᱮ ᱟᱨ ᱯᱷᱟᱴᱟᱣ ᱵᱤᱰᱟᱹᱣ",
        image: "./module_images/hazard_roof_fracture.jpg",
        keyStandard: "Systematic Support Rules (SSR) / DGMS",
        description: "ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱔᱐% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱜᱷᱚᱴᱚᱱ ᱪᱷᱟᱛ ᱧᱩᱨ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱩᱭᱩᱜ-ᱟ᱾ ᱱᱟᱣᱟ ᱯᱷᱮᱥ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱨᱚᱰ ᱛᱮ ᱪᱷᱟᱛ ᱠᱷᱚᱴᱠᱷᱚᱴᱟᱣ ᱠᱟᱛᱮ ᱵᱤᱰᱟᱹᱣ ᱢᱮ᱾",
        bulletPoints: [
          "ᱥᱟᱰᱮ ᱵᱤᱰᱟᱹᱣ ᱦᱚᱨᱟ: ᱨᱚᱰ ᱛᱮ ᱪᱷᱟᱛ ᱨᱮ ᱠᱚᱴᱟᱵ ᱢᱮ ᱟᱨ ᱛᱤ-ᱛᱟᱹᱞᱣᱟᱹ ᱛᱮ ᱪᱷᱟᱛ ᱨᱮ ᱦᱤᱞᱟᱹᱣ ᱵᱤᱰᱟᱹᱣ ᱢᱮ᱾",
          "ᱠᱮᱴᱮᱡ ᱪᱷᱟᱛ ᱥᱟᱰᱮ: ᱢᱮᱬᱦᱮᱫ ᱞᱮᱠᱟ ᱱᱤᱨᱚᱲ ᱥᱟᱰᱮ ᱟᱨ ᱪᱮᱫ ᱦᱚᱸ ᱦᱤᱞᱟᱹᱣ ᱵᱟᱝ ᱵᱩᱡᱷᱟᱹᱣᱜ-ᱟ᱾",
          "ᱞᱤᱪᱟᱹᱲ ᱪᱷᱟᱛ ᱥᱟᱰᱮ: ᱰᱷᱳᱞ ᱞᱮᱠᱟ ᱯᱷᱚᱸᱫᱟ ᱥᱟᱰᱮ ᱟᱨ ᱛᱤ ᱨᱮ ᱦᱤᱞᱟᱹᱣ ᱵᱩᱡᱷᱟᱹᱣᱜ-ᱟ; ᱱᱚᱶᱟ ᱫᱷᱤᱨᱤ ᱧᱩᱨ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾",
          "ᱞᱚᱜᱚᱱ ᱠᱟᱹᱢᱤ: ᱞᱤᱪᱟᱹᱲ ᱪᱷᱟᱛ ᱞᱟᱛᱟᱨ ᱨᱮ ᱟᱞᱚᱢ ᱛᱤᱸᱜᱩᱱᱟ; ᱞᱚᱜᱚᱱ ᱠᱷᱩᱱᱴᱤ ᱞᱟᱜᱟᱣ ᱢᱮ ᱟᱨᱵᱟᱝ ᱛᱟᱭᱚᱢᱚᱜ ᱢᱮ᱾"
        ],
        cautionTip: "ᱢᱮᱫ ᱛᱮ ᱧᱮᱞ ᱠᱟᱛᱮ ᱥᱩᱢᱩᱝ ᱟᱞᱚᱢ ᱯᱟᱹᱛᱭᱟᱹᱣᱜ-ᱟ; ᱫᱷᱤᱨᱤ ᱨᱮᱱᱟᱜ ᱵᱷᱤᱛᱤᱨ ᱯᱷᱟᱴᱟᱣ ᱥᱟᱰᱮ ᱛᱮᱜᱮ ᱵᱟᱰᱟᱭᱚᱜ-ᱟ᱾"
      },
      {
        id: "hazard_conveyor",
        tag: "ᱢᱤᱥᱤᱱ ᱵᱚᱛᱚᱨ • ᱟᱹᱪᱩᱨᱚᱜ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ",
        title: "᱓. ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ ᱟᱨ ᱯᱷᱟᱥᱟᱣ ᱵᱤᱯᱚᱫᱽ",
        image: "./module_images/hazard_conveyor_belt.jpg",
        keyStandard: "DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱟᱹᱢ / Indian Electricity Rules",
        description: "ᱠᱷᱟᱫᱟᱱ ᱨᱮᱱᱟᱜ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ ᱓.᱕ ᱢᱤᱴᱟᱨ/ᱥᱮᱠᱮᱱᱰ ᱛᱮ ᱫᱟᱹᱲᱟ᱾ ᱟᱹᱪᱩᱨᱚᱜ ᱨᱳᱞᱟᱨ ᱨᱮ ᱛᱤ ᱟᱨᱵᱟᱝ ᱠᱤᱪᱨᱤᱡ ᱯᱷᱟᱥᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱜᱚᱡ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾",
        bulletPoints: [
          "ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱯᱩᱞ-ᱣᱟᱭᱟᱨ: ᱵᱮᱞᱴ ᱥᱟᱶᱛᱮ ᱛᱟᱨ ᱛᱟᱦᱮᱸᱱᱟ; ᱟᱯᱚᱛ ᱚᱠᱛᱚ ᱛᱟᱨ ᱚᱨ ᱞᱮᱠᱷᱟᱱ ᱵᱮᱞᱴ ᱞᱚᱜᱚᱱ ᱛᱷᱟᱢᱵᱷᱟᱣᱜ-ᱟ᱾",
          "ᱡᱟᱹᱞᱤ ᱮᱥᱮᱫ: ᱨᱳᱞᱟᱨ ᱟᱨ ᱰᱨᱟᱢ ᱨᱮ ᱢᱮᱬᱦᱮᱫ ᱡᱟᱹᱞᱤ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾",
          "ᱥᱟᱯᱷᱟ ᱱᱤᱭᱟᱹᱢ: ᱪᱟᱹᱞᱩ ᱵᱮᱞᱴ ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱵᱮᱞᱪᱟ ᱛᱮ ᱠᱩᱭᱞᱟᱹ ᱥᱟᱯᱷᱟ ᱢᱟᱱᱟ ᱜᱮᱭᱟ᱾",
          "ᱯᱟᱨᱚᱢᱚᱜ ᱱᱤᱭᱟᱹᱢ: ᱵᱮᱞᱴ ᱪᱮᱛᱟᱱ ᱛᱮ ᱯᱟᱨᱚᱢᱚᱜ ᱯᱩᱞ ᱛᱮᱜᱮ ᱪᱟᱞᱟᱜ ᱢᱮ; ᱪᱟᱹᱞᱩ ᱵᱮᱞᱴ ᱪᱮᱛᱟᱱ ᱛᱮ ᱫᱚᱱ ᱢᱟᱱᱟ ᱜᱮᱭᱟ᱾"
        ],
        cautionTip: "ᱡᱷᱩᱞᱩᱜ ᱠᱤᱪᱨᱤᱡ ᱟᱨ ᱞᱮᱢᱯ ᱛᱟᱨ ᱨᱳᱞᱟᱨ ᱨᱮ ᱯᱷᱟᱥᱟᱣ ᱠᱟᱛᱮ ᱢᱟᱨᱟᱝ ᱜᱷᱚᱴᱚᱱ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾"
      },
      {
        id: "hazard_flameproof",
        tag: "ᱯᱷᱩᱴᱟᱹᱣ ᱮᱥᱮᱫ • FLP ᱵᱤᱡᱽᱞᱤ ᱵᱟᱠᱥᱟ",
        title: "᱔. ᱯᱷᱞᱮᱢᱯᱨᱩᱯᱷ (FLP) ᱵᱟᱠᱥᱟ ᱟᱨ ᱢᱟᱱᱟ ᱡᱤᱱᱤᱥ",
        image: "./module_images/hazard_gas_ch4.jpg",
        keyStandard: "DGMS / IS/IEC 60079-1 ᱯᱷᱞᱮᱢᱯᱨᱩᱯᱷ",
        description: "ᱠᱷᱟᱫᱟᱱ ᱨᱮᱱᱟᱜ ᱵᱤᱡᱽᱞᱤ ᱵᱟᱠᱥᱟ FLP ᱦᱩᱭᱩᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ ᱡᱮᱢᱚᱱ ᱵᱷᱤᱛᱤᱨ ᱨᱮᱱᱟᱜ ᱥᱯᱟᱨᱠ ᱛᱮ ᱵᱟᱦᱨᱮ ᱢᱤᱛᱷᱮᱱ ᱜᱮᱥ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱵᱟᱝ ᱞᱟᱜᱟᱣᱜ-ᱟ᱾",
        bulletPoints: [
          "ᱯᱷᱞᱮᱸᱡᱽ ᱡᱟᱭᱜᱟ: FLP ᱵᱟᱠᱥᱟ ᱡᱚᱲ ᱐.᱕ mm ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱵᱟᱝ ᱯᱷᱟᱸᱠ ᱦᱩᱭᱩᱜ ᱢᱟ᱾",
          "ᱵᱳᱞᱴ ᱯᱩᱨᱟᱹᱣ: ᱵᱟᱠᱥᱟ ᱨᱮᱱᱟᱜ ᱥᱟᱱᱟᱢ ᱵᱳᱞᱴ ᱴᱟᱭᱤᱴ ᱛᱟᱦᱮᱸᱱ ᱢᱟ; ᱢᱤᱫᱴᱟᱹᱝ ᱵᱳᱞᱴ ᱠᱚᱢ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱯᱚᱫᱽ ᱦᱩᱭᱩᱜ-ᱟ᱾",
          "ᱞᱟᱭᱤᱱ ᱨᱮ ᱵᱟᱝ ᱡᱷᱤᱡ: ᱵᱤᱡᱽᱞᱤ ᱪᱟᱹᱞᱩ ᱚᱠᱛᱚ ᱵᱟᱠᱥᱟ ᱟᱞᱚᱢ ᱡᱷᱤᱡᱟ; ᱢᱟᱬᱟᱝ LOTO ᱛᱮ ᱵᱚᱸᱫᱽ ᱢᱮ᱾",
          "ᱢᱟᱱᱟ ᱡᱤᱱᱤᱥ: ᱫᱤᱭᱟᱹᱥᱤᱞᱟᱹᱭ, ᱞᱟᱭᱤᱴᱟᱨ, ᱵᱤᱲᱤ, ᱥᱟᱫᱷᱟᱨᱚᱱ ᱢᱚᱵᱟᱭᱤᱞ ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱤᱨ ᱤᱫᱤ ᱥᱟᱹᱠᱷᱤᱛ ᱢᱟᱱᱟ ᱜᱮᱭᱟ᱾"
        ],
        cautionTip: "ᱥᱟᱫᱷᱟᱨᱚᱱ ᱢᱚᱵᱟᱭᱤᱞ ᱵᱮᱴᱟᱨᱤ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱴᱩᱯᱩᱜ ᱥᱯᱟᱨᱠ ᱛᱮ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱢᱟᱨᱟᱝ ᱯᱷᱩᱴᱟᱹᱣ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾"
      },
      {
        id: "hazard_evacuation",
        tag: "ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ • ᱟᱯᱚᱛ ᱚᱰᱚᱠᱚᱜ ᱦᱚᱨᱟ",
        title: "᱕. ᱨᱤᱯᱷᱤᱣᱩᱡᱽ ᱵᱮ, ᱞᱟᱭᱤᱯᱷᱞᱟᱭᱤᱱ ᱟᱨ ᱵᱟᱧᱪᱟᱣ ᱰᱟᱦᱟᱨ",
        image: "./module_images/hazard_water_inrush.jpg",
        keyStandard: "DGMS ᱟᱯᱚᱛ ᱥᱟᱯᱲᱟᱣ ᱯᱞᱟᱱ (EPP)",
        description: "ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱦᱮᱸᱫᱮ ᱫᱷᱩᱶᱟᱹ ᱛᱮ ᱢᱟᱨᱥᱟᱞ ᱟᱫᱚᱜ-ᱟ᱾ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱞᱟᱭᱤᱯᱷᱞᱟᱭᱤᱱ ᱨᱟᱹᱥᱤ ᱥᱟᱵ ᱠᱟᱛᱮ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱦᱩᱭᱩᱜ-ᱟ᱾",
        bulletPoints: [
          "ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜ ᱥᱟᱝᱠᱩ (Cones): ᱨᱟᱹᱥᱤ ᱨᱮ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱱ ᱥᱟᱝᱠᱩ ᱨᱮᱱᱟᱜ ᱛᱤᱠᱷᱤᱱ ᱱᱟᱠᱷᱟ ᱱᱤᱨᱚᱲ ᱦᱚᱭ ᱟᱨ ᱵᱟᱦᱨᱮ ᱰᱟᱦᱟᱨ ᱩᱫᱩᱜᱟ᱾",
          "ᱨᱤᱯᱷᱤᱣᱩᱡᱽ ᱚᱲᱟᱜ: ᱦᱚᱭ-ᱮᱥᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱲᱟᱜ ᱡᱟᱦᱟᱸ ᱔᱘ ᱴᱟᱲᱟᱝ ᱚᱠᱥᱤᱡᱮᱱ, ᱫᱟᱜ ᱟᱨ ᱯᱷᱳᱱ ᱛᱟᱦᱮᱸᱱᱟ᱾",
          "ᱞᱚᱜᱚᱱ SCSR ᱦᱚᱨᱚᱜ: ᱫᱷᱩᱶᱟᱹ ᱧᱮᱞ ᱥᱟᱶᱛᱮ ᱢᱤᱫ ᱥᱮᱠᱮᱱᱰ ᱦᱚᱸ ᱵᱟᱝ ᱵᱤᱞᱚᱢ ᱠᱟᱛᱮ ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱣᱟᱨ ᱦᱚᱨᱚᱜ ᱢᱮ᱾",
          "ᱞᱟᱛᱟᱨ ᱠᱚᱠᱚᱲᱚ ᱠᱟᱛᱮ ᱪᱟᱞᱟᱜ: ᱵᱤᱥ ᱜᱮᱥ ᱪᱮᱛᱟᱱ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ; ᱞᱟᱛᱟᱨ ᱨᱮ ᱱᱤᱨᱚᱲ ᱦᱚᱭ ᱛᱟᱦᱮᱸᱱᱟ᱾"
        ],
        cautionTip: "ᱫᱷᱩᱶᱟᱹ ᱨᱮ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱢᱩᱴᱷᱟᱹᱱ ᱟᱞᱚᱢ ᱚᱰᱚᱠᱟ; ᱢᱤᱫ ᱥᱟᱦᱮᱫ ᱛᱮᱜᱮ ᱡᱤᱣᱤ ᱪᱟᱞᱟᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾"
      }
    ],

    // Quiz 2: 3 MCQs based on Part 2 (Santali)
    quiz2Questions: [
      {
        id: "q2_1",
        question: "ᱠᱩᱭᱞᱟᱹ ᱯᱷᱮᱥ ᱨᱮ ᱢᱤᱛᱷᱮᱱ (CH4) ᱛᱤᱱᱟᱹᱜ ᱥᱟᱭᱠᱚᱲᱟ ᱦᱩᱭ ᱞᱮᱱᱠᱷᱟᱱ ᱠᱟᱹᱢᱤ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱦᱩᱭᱩᱜ-ᱟ?",
        options: [
          "0.50%",
          "1.25%",
          "5.00%",
          "15.00%"
        ],
        correctIndex: 1,
        explanation: "DGMS ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱯᱷᱮᱥ ᱨᱮ ᱢᱤᱛᱷᱮᱱ ᱑.᱒᱕% ᱦᱩᱭ ᱞᱮᱱᱠᱷᱟᱱ ᱵᱤᱡᱽᱞᱤ ᱥᱟᱯᱞᱟᱭ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱨᱮ ᱤᱫᱤ ᱡᱟᱹᱨᱩᱲ ᱠᱟᱱᱟ᱾"
      },
      {
        id: "q2_2",
        question: "ᱨᱚᱰ ᱛᱮ ᱪᱷᱟᱛ ᱠᱚᱴᱟᱵ ᱚᱠᱛᱚ ᱰᱷᱳᱞ ᱞᱮᱠᱟ ᱯᱷᱚᱸᱫᱟ ᱥᱟᱰᱮ (Drummy Sound) ᱦᱩᱭᱩᱜ ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?",
        options: [
          "ᱫᱷᱤᱨᱤ ᱯᱩᱨᱟᱹ ᱠᱮᱴᱮᱡ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ",
          "ᱪᱷᱟᱛ ᱨᱮᱱᱟᱜ ᱫᱷᱤᱨᱤ ᱢᱩᱬ ᱪᱷᱟᱛ ᱠᱷᱚᱱ ᱵᱷᱮᱜᱟᱨ ᱠᱟᱛᱮ ᱞᱤᱪᱟᱹᱲ ᱟᱠᱟᱱᱟ ᱟᱨ ᱧᱩᱨ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ",
          "ᱨᱚᱰ ᱠᱷᱟᱨᱟᱯ ᱜᱮᱭᱟ",
          "ᱱᱤᱨᱚᱲ ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ"
        ],
        correctIndex: 1,
        explanation: "ᱯᱷᱚᱸᱫᱟ ᱥᱟᱰᱮ ᱟᱨ ᱛᱤ ᱨᱮ ᱦᱤᱞᱟᱹᱣ ᱵᱩᱡᱷᱟᱹᱣ ᱩᱫᱩᱜᱟ ᱡᱮ ᱪᱷᱟᱛ ᱨᱟᱹᱯᱩᱫ ᱟᱠᱟᱱᱟ ᱟᱨ ᱡᱟᱦᱟᱸ ᱛᱤᱨᱮᱜᱮ ᱧᱩᱨ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾"
      },
      {
        id: "q2_3",
        question: "ᱟᱯᱚᱛ ᱞᱟᱭᱤᱯᱷᱞᱟᱭᱤᱱ ᱨᱟᱹᱥᱤ ᱨᱮ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱱ ᱥᱟᱝᱠᱩ (Cones) ᱧᱩᱛ ᱨᱮ ᱪᱮᱫ ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜᱟ?",
        options: [
          "ᱠᱷᱟᱫᱟᱱ ᱨᱮᱱᱟᱜ ᱜᱟᱹᱦᱤᱨ ᱜᱟᱰᱦᱟ ᱥᱮᱫ",
          "ᱥᱟᱝᱠᱩ ᱨᱮᱱᱟᱜ ᱛᱤᱠᱷᱤᱱ ᱱᱟᱠᱷᱟ ᱵᱟᱦᱨᱮ ᱱᱤᱨᱚᱲ ᱦᱚᱭ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱩᱫᱩᱜᱟ",
          "ᱱᱚᱶᱟ ᱢᱟᱨᱥᱟᱞ ᱮᱢᱚᱜ-ᱟ",
          "ᱱᱚᱶᱟ ᱥᱟᱭᱨᱮᱱ ᱥᱟᱰᱮᱭᱟ"
        ],
        correctIndex: 1,
        explanation: "ᱧᱩᱛ ᱨᱮ ᱛᱤ ᱛᱮ ᱡᱚᱴᱮᱫ ᱠᱟᱛᱮ ᱥᱟᱝᱠᱩ ᱨᱮᱱᱟᱜ ᱛᱤᱠᱷᱤᱱ ᱱᱟᱠᱷᱟ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱠᱷᱚᱱ ᱚᱰᱚᱠᱚᱜ ᱰᱟᱦᱟᱨ ᱩᱫᱩᱜᱟ᱾"
      },
      {
        id: "q2_4",
        question: "ᱠᱷᱟᱫᱟᱱ ᱠᱟᱹᱢᱤ ᱡᱟᱭᱜᱟ ᱨᱮ ᱠᱟᱨᱵᱚᱱ ᱢᱚᱱᱳᱠᱥᱟᱭᱤᱰ (CO) ᱜᱮᱥ ᱨᱮᱱᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱢᱟᱹ ᱛᱤᱱᱟᱹᱜ ᱠᱟᱱᱟ?",
        options: [
          "᱕᱐ PPM ᱠᱷᱚᱱ ᱠᱚᱢ",
          "᱒᱕᱐ PPM",
          "᱑,᱐᱐᱐ PPM",
          "᱕,᱐᱐᱐ PPM"
        ],
        correctIndex: 0,
        explanation: "ᱠᱟᱨᱵᱚᱱ ᱢᱚᱱᱳᱠᱥᱟᱭᱤᱰ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱷᱚᱱ ᱒᱑᱐ ᱜᱩᱱ ᱞᱚᱜᱚᱱ ᱢᱟᱭᱟᱢ ᱨᱮ ᱢᱮᱥᱟᱜ-ᱟ᱾ DGMS ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ CO ᱕᱐ PPM ᱠᱷᱚᱱ ᱠᱚᱢ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤ; ᱑,᱐᱐᱐ PPM ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱞᱮᱠᱷᱟᱱ ᱦᱚᱲ ᱢᱤᱱᱤᱴ ᱨᱮᱜᱮ ᱵᱮᱦᱚᱸᱥᱚᱜ-ᱟ᱾"
      },
      {
        id: "q2_5",
        question: "ᱯᱷᱞᱮᱢᱯᱨᱩᱯᱷ (FLP) ᱵᱤᱡᱽᱞᱤ ᱵᱟᱠᱥᱟ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱜᱮᱥ ᱯᱷᱩᱴᱟᱹᱣ ᱪᱮᱫ ᱞᱮᱠᱟ ᱮᱥᱮᱫᱟ?",
        options: [
          "ᱵᱟᱠᱥᱟ ᱵᱷᱤᱛᱤᱨ ᱯᱩᱨᱟᱹ ᱵᱷᱮᱠᱭᱩᱢ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ",
          "ᱵᱷᱤᱛᱤᱨ ᱨᱮ ᱞᱤᱠᱩᱭᱤᱰ ᱱᱟᱭᱴᱨᱳᱡᱮᱱ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱠᱟᱛᱮ",
          "ᱥᱟᱱᱠᱲᱟ ᱯᱷᱞᱮᱸᱡᱽ ᱰᱟᱦᱟᱨ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱨᱮᱭᱟᱲ ᱠᱟᱛᱮ ᱢᱤᱛᱷᱮᱱ ᱞᱚᱞᱚ ᱠᱷᱚᱱ ᱞᱟᱛᱟᱨ ᱟᱹᱜᱩ",
          "ᱵᱤᱱᱟᱹ ᱵᱤᱡᱽᱞᱤ ᱛᱮ ᱠᱟᱹᱢᱤ ᱠᱟᱛᱮ"
        ],
        correctIndex: 2,
        explanation: "FLP ᱵᱟᱠᱥᱟ ᱵᱷᱤᱛᱤᱨ ᱥᱯᱟᱨᱠ ᱨᱮᱱᱟᱜ ᱞᱟᱯᱷᱟᱝ ᱞᱚᱞᱚ ᱫᱚ ᱥᱟᱱᱠᱲᱟ ᱡᱚᱲ ᱛᱮ ᱨᱮᱭᱟᱲ ᱠᱟᱛᱮ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱟ, ᱡᱟᱦᱟᱸ ᱛᱮ ᱠᱷᱟᱫᱟᱱ ᱨᱮᱱᱟᱜ ᱢᱤᱛᱷᱮᱱ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱵᱟᱝ ᱞᱟᱜᱟᱣᱜ-ᱟ᱾"
      },
      {
        id: "q2_6",
        question: "ᱠᱷᱟᱫᱟᱱ ᱵᱮᱞᱴ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱨᱮ ᱟᱯᱚᱛ ᱯᱩᱞ-ᱣᱟᱭᱟᱨ (Pull-Wire) ᱛᱷᱟᱢᱵᱷᱟᱣ ᱛᱟᱨ ᱚᱠᱟᱨᱮ ᱞᱟᱜᱟᱣ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ?",
        options: [
          "ᱥᱩᱢᱩᱝ ᱪᱮᱛᱟᱱ ᱨᱮᱱᱟᱜ ᱢᱩᱬ ᱥᱟᱵᱽᱥᱴᱮᱥᱚᱱ ᱨᱮ",
          "ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱨᱮᱱᱟᱜ ᱯᱩᱨᱟᱹ ᱡᱤᱞᱤᱧ ᱰᱟᱦᱟᱨ ᱨᱮ ᱞᱮᱛᱟᱲ",
          "ᱥᱩᱢᱩᱝ ᱠᱩᱭᱞᱟᱹ ᱧᱩᱨᱩᱜ ᱦᱚᱯᱟᱨ ᱴᱷᱮᱱ",
          "ᱠᱷᱟᱫᱟᱱ ᱨᱮᱱᱟᱜ ᱚᱯᱷᱤᱥ ᱚᱲᱟᱜ ᱨᱮ"
        ],
        correctIndex: 1,
        explanation: "DGMS ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ ᱨᱮᱱᱟᱜ ᱯᱩᱨᱟᱹ ᱡᱤᱞᱤᱧ ᱛᱮ ᱯᱩᱞ-ᱣᱟᱭᱟᱨ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤ, ᱡᱮᱢᱚᱱ ᱡᱟᱦᱟᱸᱭ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱤᱯᱚᱫᱽ ᱨᱮ ᱛᱟᱨ ᱚᱨ ᱠᱟᱛᱮ ᱵᱮᱞᱴ ᱮ ᱛᱷᱟᱢᱵᱷᱟᱣ ᱫᱟᱲᱮᱭᱟᱜ ᱢᱟ᱾"
      },
      {
        id: "q2_7",
        question: "DGMS ᱥᱟᱹᱠᱷᱤᱛ ᱨᱤᱯᱷᱤᱣᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ (Refuge Chamber) ᱯᱷᱟᱥᱟᱣ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱛᱤᱱᱟᱹᱜ ᱚᱠᱛᱚ ᱡᱤᱣᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ?",
        options: [
          "᱒ ᱴᱟᱲᱟᱝ",
          "᱘ ᱴᱟᱲᱟᱝ",
          "᱑᱒ ᱴᱟᱲᱟᱝ",
          "ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱓᱖ ᱠᱷᱚᱱ ᱔᱘ ᱴᱟᱲᱟᱝ (ᱚᱠᱥᱤᱡᱮᱱ, ᱫᱟᱜ ᱟᱨ ᱥᱠᱨᱟᱵᱟᱨ ᱥᱟᱶ)"
        ],
        correctIndex: 3,
        explanation: "ᱨᱤᱯᱷᱤᱣᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ ᱨᱮ ᱚᱠᱥᱤᱡᱮᱱ, ᱠᱟᱨᱵᱚᱱ ᱰᱟᱭᱚᱠᱥᱟᱭᱤᱰ ᱥᱠᱨᱟᱵᱟᱨ, ᱫᱟᱜ ᱟᱨ ᱡᱚᱢᱟᱜ ᱛᱟᱦᱮᱸᱱᱟ ᱡᱟᱦᱟᱸ ᱓᱖ ᱠᱷᱚᱱ ᱔᱘ ᱴᱟᱲᱟᱝ ᱫᱷᱟᱹᱵᱤᱡ ᱦᱚᱲ ᱡᱤᱣᱤ ᱫᱚᱦᱚ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾"
      }
    ]
  }
};
