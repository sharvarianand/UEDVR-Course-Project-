using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

public class ARFireManager : MonoBehaviour
{
    public enum DrillPhase
    {
        ScanningEnvironment,
        ReadyToStart,
        SpawningFire,
        EquipmentDecision,
        ExecutePASS,
        FindFireExit,
        VictoryDebrief
    }

    [Header("Prefabs")]
    public GameObject firePrefab;
    public GameObject extinguisherPrefab;
    public GameObject bucketPrefab;
    public GameObject clothPrefab;

    [Header("HUD Elements")]
    public Text instructionText;
    public Text stepBadgeText;
    public Slider fireHealthSlider;
    public Image fireHealthFillImage;
    public Text fireHealthPercentText;
    public GameObject fireHealthContainer;

    [Header("Victory Debrief Modal")]
    public GameObject victoryModal;
    public Text victoryTitleText;
    public Text victorySubtitleText;
    public Button victoryBackButton;

    public static ARFireManager Instance { get; private set; }
    public bool IsFireExtinguished => currentPhase == DrillPhase.VictoryDebrief;
    public DrillPhase CurrentPhase => currentPhase;

    // State Tracking
    private DrillPhase currentPhase = DrillPhase.ScanningEnvironment;
    private ARRaycastManager arRaycastManager;
    private ARPlaneManager arPlaneManager;
    private GameObject spawnedFire;
    private GameObject spawnedExtinguisher;
    private ExtinguisherController extinguisherController;
    private bool isSpraying = false;
    private float simulationStartTime = 0f;
    private float sceneLoadTime = 0f;
    private float planeScanStartTime = -1f;

    // Decision stage 3D options
    private List<EquipmentOption3D> equipmentOptions = new List<EquipmentOption3D>();
    private EquipmentOption3D selectedEquipment = null;

    // Evacuation exit marker
    private FireExitMarker spawnedExitMarker;

    // Dynamic UI Elements
    private GameObject startButtonObj;
    private Button startSimulationButton;
    private GameObject warningBannerObj;
    private Text warningBannerText;

    // Swipe tracking for pin
    private Vector2 touchStartPos;
    private bool isTouchingPin = false;
    private bool prevInputPressed = false;

    // Fire visuals & audio
    private ParticleSystem[] fireParticles;
    private Light fireLight;
    private float[] originalEmissionRates;
    private float fireHealth = 1f;

    // Found at runtime
    private Button backButton;
    private Camera arCamera;
    private DrillVoiceoverManager voiceoverManager;

    static List<ARRaycastHit> hits = new List<ARRaycastHit>();

    void Awake()
    {
        Instance = this;
        // Enforce Landscape orientation for AR Simulation
        Screen.autorotateToPortrait = false;
        Screen.autorotateToPortraitUpsideDown = false;
        Screen.autorotateToLandscapeLeft = true;
        Screen.autorotateToLandscapeRight = true;
        Screen.orientation = ScreenOrientation.LandscapeLeft;

        arRaycastManager = GetComponent<ARRaycastManager>();
        if (arRaycastManager == null) arRaycastManager = GetComponentInParent<ARRaycastManager>();
        if (arRaycastManager == null) arRaycastManager = FindAnyObjectByType<ARRaycastManager>();

        arPlaneManager = GetComponent<ARPlaneManager>();
        if (arPlaneManager == null) arPlaneManager = FindAnyObjectByType<ARPlaneManager>();

        arCamera = Camera.main != null ? Camera.main : FindAnyObjectByType<Camera>();

        if (bucketPrefab == null) bucketPrefab = Resources.Load<GameObject>("Prefabs/AR/BucketPrefab");
        if (clothPrefab == null) clothPrefab = Resources.Load<GameObject>("Prefabs/AR/ClothPrefab");
        if (extinguisherPrefab == null) extinguisherPrefab = Resources.Load<GameObject>("Prefabs/AR/ExtinguisherPrefab");
    }

    void OnDestroy()
    {
        if (Instance == this) Instance = null;
        Screen.autorotateToPortrait = true;
        Screen.autorotateToPortraitUpsideDown = false;
        Screen.autorotateToLandscapeLeft = false;
        Screen.autorotateToLandscapeRight = false;
        Screen.orientation = ScreenOrientation.Portrait;
    }

    void Start()
    {
        sceneLoadTime = Time.time;

        if (arCamera == null)
            arCamera = Camera.main != null ? Camera.main : FindAnyObjectByType<Camera>();

        // Ensure Directional Light exists for realistic highlights and shadows on 3D equipment
        if (FindAnyObjectByType<Light>() == null)
        {
            GameObject lightObj = new GameObject("ARDirectionalLight");
            Light dirLight = lightObj.AddComponent<Light>();
            dirLight.type = LightType.Directional;
            dirLight.color = new Color(1f, 0.98f, 0.95f);
            dirLight.intensity = 1.3f;
            lightObj.transform.rotation = Quaternion.Euler(50f, -30f, 0f);
        }

        // Ensure EventSystem has an input module for UI
        var eventSystem = FindAnyObjectByType<UnityEngine.EventSystems.EventSystem>();
        if (eventSystem != null && eventSystem.GetComponent<UnityEngine.EventSystems.BaseInputModule>() == null)
        {
#if ENABLE_INPUT_SYSTEM
            eventSystem.gameObject.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
            eventSystem.gameObject.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
#endif
        }

        ReadAndroidIntentExtras();
        FindOrCreateUIElements();

        // Start Phase 1: Environment Scanning
        EnterPhase(DrillPhase.ScanningEnvironment);
    }

    private void ReadAndroidIntentExtras()
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        try
        {
            using (AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
            using (AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity"))
            {
                if (currentActivity != null)
                {
                    AndroidJavaObject intent = currentActivity.Call<AndroidJavaObject>("getIntent");
                    if (intent != null)
                    {
                        string incomingWorker = intent.Call<string>("getStringExtra", "worker_id");
                        if (!string.IsNullOrEmpty(incomingWorker))
                        {
                            PlayerPrefs.SetString("WorkerID", incomingWorker.Trim().ToUpperInvariant());
                            PlayerPrefs.Save();
                        }

                        string incomingLang = intent.Call<string>("getStringExtra", "language");
                        if (!string.IsNullOrEmpty(incomingLang) && LanguageManager.Instance != null)
                        {
                            if (incomingLang.Equals("Hindi", StringComparison.OrdinalIgnoreCase))
                                LanguageManager.Instance.SetLanguage(LanguageManager.Language.Hindi);
                            else if (incomingLang.Equals("Santali", StringComparison.OrdinalIgnoreCase))
                                LanguageManager.Instance.SetLanguage(LanguageManager.Language.Santali);
                            else if (incomingLang.Equals("English", StringComparison.OrdinalIgnoreCase))
                                LanguageManager.Instance.SetLanguage(LanguageManager.Language.English);
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Debug.LogWarning("[ARFireManager] Intent read warning: " + ex.Message);
        }
#endif
    }

    private void FindOrCreateUIElements()
    {
        // Find back button
        var allButtons = FindObjectsByType<Button>(FindObjectsInactive.Include);
        foreach (var btn in allButtons)
        {
            if (btn.gameObject.name == "BackHomeButton")
            {
                backButton = btn;
                backButton.onClick.RemoveAllListeners();
                backButton.onClick.AddListener(() => {
                    JohAR.AR.ReturnToReactBridge.ExecuteReturn();
                });
                backButton.gameObject.SetActive(false);
            }
        }

        // Programmatically create "Start Simulation" button and Warning banner on main Canvas
        Canvas mainCanvas = FindAnyObjectByType<Canvas>();
        if (mainCanvas != null)
        {
            // 1. Start Simulation Button
            startButtonObj = new GameObject("StartSimulationButton");
            startButtonObj.transform.SetParent(mainCanvas.transform, false);
            startButtonObj.transform.SetAsLastSibling();
            RectTransform startRt = startButtonObj.AddComponent<RectTransform>();
            startRt.anchorMin = new Vector2(0.5f, 0.12f);
            startRt.anchorMax = new Vector2(0.5f, 0.12f);
            startRt.sizeDelta = new Vector2(280f, 56f);

            Image startBg = startButtonObj.AddComponent<Image>();
            startBg.color = new Color(0.96f, 0.62f, 0.04f, 0.95f); // Amber

            startSimulationButton = startButtonObj.AddComponent<Button>();
            startSimulationButton.targetGraphic = startBg;
            startSimulationButton.onClick.AddListener(OnStartSimulationButtonClicked);

            GameObject textObj = new GameObject("Text");
            textObj.transform.SetParent(startButtonObj.transform, false);
            Text startText = textObj.AddComponent<Text>();
            startText.raycastTarget = false;
            startText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            if (startText.font == null) startText.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
            startText.alignment = TextAnchor.MiddleCenter;
            startText.fontSize = 20;
            startText.fontStyle = FontStyle.Bold;
            startText.color = new Color(0.06f, 0.07f, 0.1f);
            RectTransform textRt = textObj.GetComponent<RectTransform>();
            textRt.anchorMin = Vector2.zero;
            textRt.anchorMax = Vector2.one;
            textRt.sizeDelta = Vector2.zero;

            LanguageManager.Language lang = LanguageManager.Instance != null
                ? LanguageManager.Instance.CurrentLanguage
                : LanguageManager.Language.English;

            switch (lang)
            {
                case LanguageManager.Language.Hindi: startText.text = "▶ सिमुलेशन शुरू करें"; break;
                case LanguageManager.Language.Santali: startText.text = "▶ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱮᱦᱚᱵ ᱢᱮ"; break;
                default: startText.text = "▶ START SIMULATION"; break;
            }

            startButtonObj.SetActive(false);

            // 2. Warning Banner
            warningBannerObj = new GameObject("EquipmentWarningBanner");
            warningBannerObj.transform.SetParent(mainCanvas.transform, false);
            RectTransform warnRt = warningBannerObj.AddComponent<RectTransform>();
            warnRt.anchorMin = new Vector2(0.5f, 0.76f);
            warnRt.anchorMax = new Vector2(0.5f, 0.76f);
            warnRt.sizeDelta = new Vector2(620f, 64f);

            Image warnBg = warningBannerObj.AddComponent<Image>();
            warnBg.color = new Color(0.65f, 0.08f, 0.08f, 0.92f); // Dark red

            GameObject warnTextObj = new GameObject("Text");
            warnTextObj.transform.SetParent(warningBannerObj.transform, false);
            warningBannerText = warnTextObj.AddComponent<Text>();
            warningBannerText.font = startText.font;
            warningBannerText.alignment = TextAnchor.MiddleCenter;
            warningBannerText.fontSize = 17;
            warningBannerText.fontStyle = FontStyle.Bold;
            warningBannerText.color = Color.white;
            RectTransform wtRt = warnTextObj.GetComponent<RectTransform>();
            wtRt.anchorMin = Vector2.zero;
            wtRt.anchorMax = Vector2.one;
            wtRt.sizeDelta = new Vector2(-20f, -10f);

            warningBannerObj.SetActive(false);
        }
    }

    private void PlayVoiceover(DrillVoiceoverManager.DrillStep step)
    {
        if (voiceoverManager == null)
            voiceoverManager = FindAnyObjectByType<DrillVoiceoverManager>();

        if (voiceoverManager == null)
        {
            GameObject voObj = new GameObject("DrillVoiceoverManager");
            voiceoverManager = voObj.AddComponent<DrillVoiceoverManager>();
        }

        voiceoverManager.PlayStepVoiceover(step);
    }

    // =========================================================================
    // STATE MACHINE TRANSITIONS
    // =========================================================================

    public void EnterPhase(DrillPhase nextPhase)
    {
        currentPhase = nextPhase;
        Debug.Log($"[ARFireManager] Phase -> {currentPhase}");

        switch (currentPhase)
        {
            case DrillPhase.ScanningEnvironment:
                UpdateInstructionText(
                    "Move your phone around to scan the floor & surroundings.",
                    "फर्श और आसपास के वातावरण को स्कैन करने के लिए अपने फोन को घुमाएं।",
                    "ᱚᱛ ᱟᱨ ᱟᱰᱮᱯᱟᱥᱮ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱳᱱ ᱟᱹᱪᱩᱨ ᱢᱮ᱾",
                    "SCANNING ENVIRONMENT", "वातावरण स्कैन", "ᱚᱛ ᱥᱠᱮᱱ"
                );
                PlayVoiceover(DrillVoiceoverManager.DrillStep.Step0_ScanEnvironment);
                if (fireHealthContainer != null) fireHealthContainer.SetActive(false);
                if (startButtonObj != null) startButtonObj.SetActive(false);
                break;

            case DrillPhase.ReadyToStart:
                UpdateInstructionText(
                    "Floor mapped! Tap 'START SIMULATION' on screen to begin.",
                    "फर्श मिल गया! शुरू करने के लिए 'Start Simulation' पर टैप करें।",
                    "ᱚᱛ ᱧᱟᱢ ᱮᱱᱟ! ᱮᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ 'Start Simulation' ᱴᱮᱯ ᱢᱮ᱾",
                    "READY TO COMMENCE", "सिमुलेशन तैयार", "ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱛᱮᱭᱟᱨ"
                );
                if (startButtonObj != null) startButtonObj.SetActive(true);
                break;

            case DrillPhase.SpawningFire:
                if (startButtonObj != null) startButtonObj.SetActive(false);
                simulationStartTime = Time.time;
                SpawnFireAutomatically();
                StartCoroutine(FireIgnitionDelayRoutine());
                break;

            case DrillPhase.EquipmentDecision:
                UpdateInstructionText(
                    "EMERGENCY! Select the appropriate equipment in front of you.",
                    "आपातकाल! अपने सामने दिख रहे विकल्पों में से उचित उपकरण चुनें।",
                    "ᱮᱢᱟᱨᱡᱮᱱᱥᱤ! ᱟᱢ ᱥᱟᱢᱟᱝ ᱨᱮ ᱴᱷᱤᱠ ᱥᱟᱯᱟᱵ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾",
                    "EQUIPMENT DECISION", "उपकरण चयन", "ᱥᱟᱯᱟᱵ ᱵᱟᱪᱷᱟᱣ"
                );
                PlayVoiceover(DrillVoiceoverManager.DrillStep.Step0_ChooseEquipment);
                SpawnEquipmentOptions3D();
                break;

            case DrillPhase.ExecutePASS:
                UpdateInstructionText(1,
                    "Tap the yellow tamper seal to remove it.",
                    "पीले सील पर टैप करके उसे निकालें।",
                    "Sasang seal tap kate ocog me."
                );
                PlayVoiceover(DrillVoiceoverManager.DrillStep.Step1_RemoveSeal);
                break;

            case DrillPhase.FindFireExit:
                if (isSpraying) SetSpray(false);
                if (fireHealthContainer != null) fireHealthContainer.SetActive(false);
                if (spawnedExtinguisher != null) Destroy(spawnedExtinguisher, 1.5f);

                UpdateInstructionText(
                    "Fire extinguished! Look around to find the EMERGENCY FIRE EXIT and tap it to evacuate!",
                    "आग बुझ गई! आपातकालीन निकास (Fire Exit) खोजने के लिए चारों ओर देखें और उस पर टैप करें!",
                    "ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱮᱱᱟ! EMERGENCY FIRE EXIT ᱯᱟᱸᱡᱟᱭ ᱢᱮ ᱟᱨ ᱴᱮᱯ ᱢᱮ!",
                    "EVACUATION PROTOCOL", "निकासी प्रोटोकॉल", "ᱚᱰᱳᱠᱚᱜ ᱦᱚᱨᱟ"
                );
                PlayVoiceover(DrillVoiceoverManager.DrillStep.Step5_FindFireExit);
                SpawnEmergencyExitMarker();
                break;

            case DrillPhase.VictoryDebrief:
                OnEvacuationComplete();
                break;
        }
    }

    // =========================================================================
    // UPDATE LOOP
    // =========================================================================

    void Update()
    {
        if (currentPhase == DrillPhase.VictoryDebrief) return;

        // Phase 1: Environment Scanning
        if (currentPhase == DrillPhase.ScanningEnvironment)
        {
            CheckPlaneScanningProgress();
            return;
        }

        // Phase 2: Ready To Start (Screen tap or Button click)
        if (currentPhase == DrillPhase.ReadyToStart)
        {
            bool isDown, isHeld, isUp;
            Vector2 touchPos;
            if (GetInputState(out isDown, out isHeld, out isUp, out touchPos) && isDown)
            {
                Debug.Log($"[ARFireManager] Screen tap detected in ReadyToStart at {touchPos}, commencing fire simulation!");
                OnStartSimulationButtonClicked();
                return;
            }
            return;
        }

        // Phase 4: Equipment Decision Taps
        if (currentPhase == DrillPhase.EquipmentDecision)
        {
            HandleEquipmentSelectionTouch();
            return;
        }

        // Phase 5: PASS Protocol execution
        if (currentPhase == DrillPhase.ExecutePASS)
        {
            HandleTapOnExtinguisher();
            HandleExtinguishing();
            return;
        }

        // Phase 6: Evacuation Exit Marker Taps
        if (currentPhase == DrillPhase.FindFireExit)
        {
            HandleFireExitTouch();
            return;
        }
    }

    private void CheckPlaneScanningProgress()
    {
        if (Time.time - sceneLoadTime < 0.8f) return;

        int planeCount = 0;
        if (arPlaneManager != null)
        {
            foreach (var plane in arPlaneManager.trackables)
            {
                if (plane.alignment == PlaneAlignment.HorizontalUp) planeCount++;
            }
        }

        // If at least one horizontal plane is tracked, mark ready to start
        if (planeCount > 0 || (Time.time - sceneLoadTime > 4.5f))
        {
            EnterPhase(DrillPhase.ReadyToStart);
        }
    }

    private void OnStartSimulationButtonClicked()
    {
        if (currentPhase == DrillPhase.ReadyToStart)
        {
            EnterPhase(DrillPhase.SpawningFire);
        }
    }

    // =========================================================================
    // AUTOMATIC FIRE PLACEMENT ON SCANNED PLANE
    // =========================================================================

    private void SpawnFireAutomatically()
    {
        Camera cam = arCamera != null ? arCamera : Camera.main;
        if (cam == null) cam = FindAnyObjectByType<Camera>();

        Vector3 spawnPos = Vector3.zero;
        Quaternion spawnRot = Quaternion.identity;

        // Try center AR Raycast against detected planes
        Vector2 screenCenter = new Vector2(Screen.width * 0.5f, Screen.height * 0.5f);
        if (arRaycastManager != null && arRaycastManager.Raycast(screenCenter, hits, TrackableType.PlaneWithinPolygon | TrackableType.PlaneWithinBounds))
        {
            spawnPos = hits[0].pose.position;
            spawnRot = Quaternion.identity;
        }
        else if (cam != null)
        {
            // Position fire ~1.9m ahead on floor
            spawnPos = cam.transform.position + cam.transform.forward * 1.85f + Vector3.down * 0.45f;
            spawnRot = Quaternion.identity;
        }

        if (firePrefab != null)
        {
            spawnedFire = Instantiate(firePrefab, spawnPos, spawnRot);
            spawnedFire.name = "ActiveHazardFire";
        }
        else
        {
            // Fallback fire
            spawnedFire = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            spawnedFire.transform.position = spawnPos;
            spawnedFire.GetComponent<Renderer>().material.color = Color.red;
        }

        fireHealth = 1f;
        if (fireHealthContainer != null) fireHealthContainer.SetActive(true);
        if (fireHealthSlider != null) fireHealthSlider.value = 1f;
        if (fireHealthFillImage != null) fireHealthFillImage.fillAmount = 1f;
        if (fireHealthPercentText != null) fireHealthPercentText.text = "100%";

        fireParticles = spawnedFire.GetComponentsInChildren<ParticleSystem>();
        fireLight = spawnedFire.GetComponentInChildren<Light>();
        if (fireLight == null)
        {
            GameObject lightObj = new GameObject("FireLight");
            lightObj.transform.SetParent(spawnedFire.transform, false);
            lightObj.transform.localPosition = new Vector3(0f, 0.4f, 0f);
            fireLight = lightObj.AddComponent<Light>();
            fireLight.color = new Color(1f, 0.45f, 0.1f);
            fireLight.intensity = 3.5f;
            fireLight.range = 5f;
        }

        if (fireParticles != null && fireParticles.Length > 0)
        {
            originalEmissionRates = new float[fireParticles.Length];
            for (int i = 0; i < fireParticles.Length; i++)
                originalEmissionRates[i] = fireParticles[i].emission.rateOverTime.constant;
        }

        UpdateInstructionText(
            "⚠️ EMERGENCY: Flame erupted on mine haulage floor!",
            "⚠️ आपातकाल: खदान तल पर आग लग गई है!",
            "⚠️ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ: ᱠᱳᱭᱞᱟ ᱚᱛ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱱᱟ!",
            "HAZARD DETECTED", "आग की चेतावनी", "ᱥᱮᱸᱜᱮᱞ ᱪᱮᱛᱟᱣᱱᱤ"
        );
        PlayVoiceover(DrillVoiceoverManager.DrillStep.Step0_SpawnFire);
    }

    private IEnumerator FireIgnitionDelayRoutine()
    {
        yield return new WaitForSeconds(2.4f);
        if (currentPhase == DrillPhase.SpawningFire)
        {
            EnterPhase(DrillPhase.EquipmentDecision);
        }
    }

    // =========================================================================
    // 3D EQUIPMENT DECISION CHALLENGE
    // =========================================================================

    private void SpawnEquipmentOptions3D()
    {
        equipmentOptions.Clear();
        Camera cam = arCamera != null ? arCamera : Camera.main;
        if (cam == null) cam = FindAnyObjectByType<Camera>();

        Vector3 camPos = cam != null ? cam.transform.position : Vector3.zero;
        Vector3 camFwd = cam != null ? cam.transform.forward : Vector3.forward;
        Vector3 camRight = cam != null ? cam.transform.right : Vector3.right;

        // Calculate a clean horizontal forward & right on the floor plane
        Vector3 forwardFlat = new Vector3(camFwd.x, 0f, camFwd.z).normalized;
        if (forwardFlat.sqrMagnitude < 0.001f) forwardFlat = Vector3.forward;
        Vector3 rightFlat = Vector3.Cross(Vector3.up, forwardFlat).normalized;

        // Height: spawn slightly below camera eye-level (~0.26m down) so user looks down at them comfortably
        float spawnY = camPos.y - 0.26f;
        Vector3 centerBase = new Vector3(camPos.x, spawnY, camPos.z) + forwardFlat * 1.05f;

        // Spread the 3 options in a gentle arc facing the camera:
        // Center: Fire Extinguisher (0m)
        // Left: Water Bucket (-0.36m right, +0.05m forward curve)
        // Right: Wet Cloth (+0.36m right, +0.05m forward curve)
        Vector3 centerPos = centerBase;
        Vector3 leftPos = centerBase - rightFlat * 0.36f + forwardFlat * 0.05f;
        Vector3 rightPos = centerBase + rightFlat * 0.36f + forwardFlat * 0.05f;

        Vector3 toCamCenter = new Vector3(camPos.x - centerPos.x, 0f, camPos.z - centerPos.z).normalized;
        Vector3 toCamLeft = new Vector3(camPos.x - leftPos.x, 0f, camPos.z - leftPos.z).normalized;
        Vector3 toCamRight = new Vector3(camPos.x - rightPos.x, 0f, camPos.z - rightPos.z).normalized;

        // 1. Water Bucket (Left)
        GameObject waterObj = new GameObject("Option_Water");
        waterObj.transform.position = leftPos;
        waterObj.transform.rotation = Quaternion.LookRotation(toCamLeft);
        EquipmentOption3D optWater = waterObj.AddComponent<EquipmentOption3D>();
        optWater.Initialize(EquipmentOption3D.ToolType.Water, bucketPrefab, OnEquipmentOptionSelected);
        equipmentOptions.Add(optWater);

        // 2. Fire Extinguisher (CENTER)
        GameObject extObj = new GameObject("Option_Extinguisher");
        extObj.transform.position = centerPos;
        extObj.transform.rotation = Quaternion.LookRotation(toCamCenter);
        EquipmentOption3D optExt = extObj.AddComponent<EquipmentOption3D>();
        optExt.Initialize(EquipmentOption3D.ToolType.Extinguisher, extinguisherPrefab, OnEquipmentOptionSelected);
        equipmentOptions.Add(optExt);

        // 3. Wet Cloth (Right)
        GameObject clothObj = new GameObject("Option_WetCloth");
        clothObj.transform.position = rightPos;
        clothObj.transform.rotation = Quaternion.LookRotation(toCamRight);
        EquipmentOption3D optCloth = clothObj.AddComponent<EquipmentOption3D>();
        optCloth.Initialize(EquipmentOption3D.ToolType.WetCloth, clothPrefab, OnEquipmentOptionSelected);
        equipmentOptions.Add(optCloth);
    }

    private void HandleEquipmentSelectionTouch()
    {
        bool isDown, isHeld, isUp;
        Vector2 touchPos;
        if (!GetInputState(out isDown, out isHeld, out isUp, out touchPos)) return;
        if (!isDown) return;

        Camera cam = arCamera != null ? arCamera : Camera.main;
        if (cam == null) return;

        Ray ray = cam.ScreenPointToRay(touchPos);
        RaycastHit[] allHits = Physics.RaycastAll(ray, 10f);

        foreach (var h in allHits)
        {
            EquipmentOption3D opt = h.collider.GetComponentInParent<EquipmentOption3D>();
            if (opt != null)
            {
                opt.OnTapped();
                return;
            }
        }
    }

    private void OnEquipmentOptionSelected(EquipmentOption3D chosen)
    {
        if (chosen.toolType == EquipmentOption3D.ToolType.Water)
        {
            chosen.ShakeWarning();
            ShowWarningBanner("⚠️ DANGER! Never use Water on Mine Electrical or Coal Fires! Risk of explosion.");
            PlayVoiceover(DrillVoiceoverManager.DrillStep.Step0_WarningWater);
            return;
        }

        if (chosen.toolType == EquipmentOption3D.ToolType.WetCloth)
        {
            chosen.ShakeWarning();
            ShowWarningBanner("⚠️ INSUFFICIENT! A wet cloth cannot suppress underground coal blazes! Select appropriate equipment.");
            PlayVoiceover(DrillVoiceoverManager.DrillStep.Step0_WarningCloth);
            return;
        }

        // Correct choice: Fire Extinguisher!
        if (chosen.toolType == EquipmentOption3D.ToolType.Extinguisher)
        {
            if (warningBannerObj != null) warningBannerObj.SetActive(false);

            // Fade out incorrect models
            foreach (var opt in equipmentOptions)
            {
                if (opt != chosen) opt.AnimateDeselectFade();
            }

            Destroy(chosen.gameObject, 0.2f);
            SpawnActiveExtinguisher();
            EnterPhase(DrillPhase.ExecutePASS);
        }
    }

    private void ShowWarningBanner(string msg)
    {
        if (warningBannerObj != null)
        {
            warningBannerObj.SetActive(true);
            if (warningBannerText != null) warningBannerText.text = msg;
            StopCoroutine("HideWarningRoutine");
            StartCoroutine("HideWarningRoutine");
        }
    }

    private IEnumerator HideWarningRoutine()
    {
        yield return new WaitForSeconds(3.8f);
        if (warningBannerObj != null) warningBannerObj.SetActive(false);
    }

    private void SpawnActiveExtinguisher()
    {
        if (extinguisherPrefab != null)
        {
            spawnedExtinguisher = Instantiate(extinguisherPrefab);
        }
        else
        {
            spawnedExtinguisher = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            spawnedExtinguisher.name = "FallbackExtinguisher";
            spawnedExtinguisher.transform.localScale = new Vector3(0.15f, 0.35f, 0.15f);
            spawnedExtinguisher.GetComponent<Renderer>().material.color = Color.red;
            spawnedExtinguisher.AddComponent<ExtinguisherController>();
        }

        extinguisherController = spawnedExtinguisher.GetComponent<ExtinguisherController>();
        if (extinguisherController != null && spawnedFire != null)
            extinguisherController.SetFireTarget(spawnedFire.transform);
    }

    // =========================================================================
    // PASS PROTOCOL TOUCH HANDLING
    // =========================================================================

    private void HandleTapOnExtinguisher()
    {
        if (extinguisherController == null) return;

        bool isDown, isHeld, isUp;
        Vector2 touchPos;
        if (!GetInputState(out isDown, out isHeld, out isUp, out touchPos))
        {
            if (isSpraying) SetSpray(false);
            return;
        }

        Camera cam = arCamera != null ? arCamera : Camera.main;
        if (cam == null) cam = FindAnyObjectByType<Camera>();
        if (cam == null) return;

        Ray ray = cam.ScreenPointToRay(touchPos);

        bool hitSealDirect = false;
        bool hitPinDirect = false;
        bool hitExtinguisherDirect = false;
        Vector3 hitPoint = Vector3.zero;

        RaycastHit[] hitsAll = Physics.RaycastAll(ray, 15f);
        foreach (var h in hitsAll)
        {
            string n = h.collider.gameObject.name.ToLower();
            if (n.Contains("seal")) hitSealDirect = true;
            if (n.Contains("pin")) hitPinDirect = true;
            if (n.Contains("extinguisher") || h.collider.transform.IsChildOf(extinguisherController.transform))
            {
                hitExtinguisherDirect = true;
                hitPoint = h.point;
            }
        }

        Vector3 sealPos = extinguisherController.sealObject != null
            ? extinguisherController.sealObject.position
            : extinguisherController.transform.position + extinguisherController.transform.up * 0.35f;

        Vector3 pinPos = extinguisherController.pinObject != null
            ? extinguisherController.pinObject.position
            : extinguisherController.transform.position + extinguisherController.transform.up * 0.35f;

        Vector2 screenSealPos = cam.WorldToScreenPoint(sealPos);
        Vector2 screenPinPos = cam.WorldToScreenPoint(pinPos);
        Vector2 screenExtPos = cam.WorldToScreenPoint(extinguisherController.transform.position);

        float distToSeal = Vector2.Distance(touchPos, screenSealPos);
        float distToPin = Vector2.Distance(touchPos, screenPinPos);
        float distToExt = Vector2.Distance(touchPos, screenExtPos);

        float touchRadius = Mathf.Max(Screen.width * 0.35f, 280f);

        // State 1: Remove Seal
        if (!extinguisherController.isSealRemoved)
        {
            if (isDown)
            {
                if (hitSealDirect || distToSeal < touchRadius || (hitExtinguisherDirect && hitPoint.y > extinguisherController.transform.position.y) || distToExt < touchRadius)
                {
                    extinguisherController.RemoveSeal();
                    UpdateInstructionText(2,
                        "Slide or tap the pin to pull it out.",
                        "पिन को बाहर निकालने के लिए उस पर स्लाइड या टैप करें।",
                        "Pin ocog lagit slide se tap me."
                    );
                    PlayVoiceover(DrillVoiceoverManager.DrillStep.Step2_PullPin);
                }
            }
            return;
        }

        // State 2: Pull Pin
        if (!extinguisherController.isPinRemoved)
        {
            if (isDown)
            {
                if (hitPinDirect || distToPin < touchRadius || hitExtinguisherDirect || distToExt < touchRadius)
                {
                    isTouchingPin = true;
                    touchStartPos = touchPos;
                }
            }

            if (isTouchingPin && isHeld)
            {
                float swipeDist = Vector2.Distance(touchPos, touchStartPos);
                if (swipeDist > 30f)
                {
                    extinguisherController.RemovePin();
                    isTouchingPin = false;
                    UpdateInstructionText(3,
                        "Tap and hold the extinguisher to SPRAY and move close to fire.",
                        "आग लगी है! Extinguisher को दबाकर रखें और आग के पास जाएं।",
                        "Sengel lagao akana! Extinguisher lin ar sengel tala jao."
                    );
                    PlayVoiceover(DrillVoiceoverManager.DrillStep.Step3_AimSqueeze);
                }
            }

            if (isUp && isTouchingPin)
            {
                extinguisherController.RemovePin();
                isTouchingPin = false;
                UpdateInstructionText(3,
                    "Tap and hold the extinguisher to SPRAY and move close to fire.",
                    "आग लगी है! Extinguisher को दबाकर रखें और आग के पास जाएं।",
                    "Sengel lagao akana! Extinguisher lin ar sengel tala jao."
                );
                PlayVoiceover(DrillVoiceoverManager.DrillStep.Step3_AimSqueeze);
            }
            return;
        }

        // State 3: Spraying
        if (isHeld)
        {
            if (hitExtinguisherDirect || distToExt < touchRadius * 1.5f)
            {
                if (!isSpraying) SetSpray(true);
            }
            else
            {
                if (isSpraying) SetSpray(false);
            }
        }
        else
        {
            if (isSpraying) SetSpray(false);
        }
    }

    private void SetSpray(bool state)
    {
        if (isSpraying == state) return;
        isSpraying = state;

        if (extinguisherController != null)
        {
            if (isSpraying) extinguisherController.StartSpray();
            else extinguisherController.StopSpray();
        }

        if (isSpraying)
        {
            UpdateInstructionText(
                "Spraying! Move closer to the fire base!",
                "स्प्रे कर रहे हैं! आग के पास जाएं!",
                "Spray ho raha! Sengel tala jao!"
            );
            PlayVoiceover(DrillVoiceoverManager.DrillStep.Step4_Spraying);
        }
        else
        {
            UpdateInstructionText(
                "Tap and hold the extinguisher to SPRAY and move close to fire.",
                "आग लगी है! Extinguisher को दबाकर रखें और आग के पास जाएं।",
                "Sengel lagao akana! Extinguisher lin ar sengel tala jao."
            );
        }
    }

    private void HandleExtinguishing()
    {
        if (extinguisherController == null) return;

        if (isSpraying && spawnedFire != null)
        {
            float distance = Vector3.Distance(
                extinguisherController.transform.position,
                spawnedFire.transform.position
            );

            if (distance <= 1.6f)
            {
                float effectMultiplier = 1f - (distance / 1.6f);
                fireHealth -= 0.45f * effectMultiplier * Time.deltaTime;
                fireHealth = Mathf.Clamp01(fireHealth);
            }
        }

        if (fireHealthSlider != null) fireHealthSlider.value = fireHealth;
        if (fireHealthFillImage != null) fireHealthFillImage.fillAmount = fireHealth;
        if (fireHealthPercentText != null) fireHealthPercentText.text = $"{Mathf.CeilToInt(fireHealth * 100f)}%";

        UpdateFireVisuals(fireHealth);

        if (fireHealth <= 0f)
        {
            // Extinguished! Advance to evacuation phase
            if (spawnedFire != null) Destroy(spawnedFire, 0.8f);
            EnterPhase(DrillPhase.FindFireExit);
        }
    }

    private void UpdateFireVisuals(float health)
    {
        if (fireParticles != null)
        {
            for (int i = 0; i < fireParticles.Length; i++)
            {
                var em = fireParticles[i].emission;
                em.rateOverTime = originalEmissionRates[i] * health;
            }
        }

        if (fireLight != null)
            fireLight.intensity = 3.5f * health;

        if (spawnedFire != null)
            spawnedFire.transform.localScale = Vector3.one * Mathf.Lerp(0.2f, 1f, health);
    }

    // =========================================================================
    // EVACUATION EXIT DRILL
    // =========================================================================

    private void SpawnEmergencyExitMarker()
    {
        Camera cam = arCamera != null ? arCamera : Camera.main;
        if (cam == null) cam = FindAnyObjectByType<Camera>();

        Vector3 camPos = cam != null ? cam.transform.position : Vector3.zero;
        Vector3 forward = cam != null ? cam.transform.forward : Vector3.forward;
        Vector3 right = cam != null ? cam.transform.right : Vector3.right;

        // Place Exit Marker at 70 degrees off-axis from initial forward, 2.4m away
        Vector3 exitDir = Quaternion.Euler(0f, 70f, 0f) * forward;
        Vector3 exitPos = camPos + exitDir.normalized * 2.4f + Vector3.up * 0.1f;

        GameObject exitObj = new GameObject("3D_EmergencyFireExit");
        exitObj.transform.position = exitPos;
        spawnedExitMarker = exitObj.AddComponent<FireExitMarker>();
        spawnedExitMarker.Initialize(OnEvacuationComplete);
    }

    private void HandleFireExitTouch()
    {
        bool isDown, isHeld, isUp;
        Vector2 touchPos;
        if (!GetInputState(out isDown, out isHeld, out isUp, out touchPos)) return;
        if (!isDown) return;

        Camera cam = arCamera != null ? arCamera : Camera.main;
        if (cam == null) return;

        Ray ray = cam.ScreenPointToRay(touchPos);
        RaycastHit[] allHits = Physics.RaycastAll(ray, 15f);

        foreach (var h in allHits)
        {
            FireExitMarker exit = h.collider.GetComponentInParent<FireExitMarker>();
            if (exit != null)
            {
                exit.OnTapped();
                return;
            }
        }
    }

    private void OnEvacuationComplete()
    {
        currentPhase = DrillPhase.VictoryDebrief;
        float duration = Time.time - simulationStartTime;
        if (duration < 1f) duration = 12.4f;

        // Record completed AR drill to offline database and trigger cloud sync
        JohAR.Data.OfflineSyncManager.Instance.RecordTrainingSession("FIRE_SAFETY_PASS", true, duration, 100, 3);

        string currentWorkerId = PlayerPrefs.GetString("WorkerID", "W-7042");
        PlayerPrefs.SetInt($"Drill_FireSafety_{currentWorkerId}", 1);
        PlayerPrefs.SetFloat($"Drill_FireSafety_Time_{currentWorkerId}", duration);
        PlayerPrefs.SetInt($"Drill_FireSafety_Score_{currentWorkerId}", 100);
        PlayerPrefs.Save();

        LanguageManager.Language lang = LanguageManager.Instance != null
            ? LanguageManager.Instance.CurrentLanguage
            : LanguageManager.Language.English;

        bool isOnline = JohAR.Data.OfflineSyncManager.Instance.IsOnline;
        string syncPill = isOnline ? "✓ Synced Online" : "💾 Stored Offline";

        if (victoryModal != null)
        {
            victoryModal.SetActive(true);
            if (victoryTitleText != null)
            {
                switch (lang)
                {
                    case LanguageManager.Language.Hindi: victoryTitleText.text = "अभ्यास पूरा हुआ • सफल निकासी!"; break;
                    case LanguageManager.Language.Santali: victoryTitleText.text = "ᱦᱮᱣᱟ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ • ᱚᱰᱳᱠ ᱥᱟᱹᱛ ᱮᱱᱟ!"; break;
                    default: victoryTitleText.text = "DRILL COMPLETE • EVACUATION SUCCESSFUL"; break;
                }
            }

            if (victorySubtitleText != null)
            {
                switch (lang)
                {
                    case LanguageManager.Language.Hindi:
                        victorySubtitleText.text = $"उपकरण चयन: 100% • P.A.S.S. सफल • निकास सुरक्षित!\nसमय: {duration:F1}s • स्कोर: 100/100 (Grade A+) • ★★★\n[{syncPill}]";
                        break;
                    case LanguageManager.Language.Santali:
                        victorySubtitleText.text = $"ᱥᱟᱯᱟᱵ: 100% • P.A.S.S. ᱠᱟᱹᱢᱤ • ᱚᱰᱳᱠ ᱱᱤᱨᱟᱯᱚᱭ!\nᱚᱠᱛᱚ: {duration:F1}s • ᱥᱠᱳᱨ: 100/100 (Grade A+) • ★★★\n[{syncPill}]";
                        break;
                    default:
                        victorySubtitleText.text = $"Equipment Choice: 100% • P.A.S.S. Executed • Evacuated Safely!\nTime: {duration:F1}s • Score: 100/100 (Grade A+) • ★★★\n[{syncPill}]";
                        break;
                }
            }

            if (victoryBackButton != null)
            {
                if (victoryBackButton.GetComponent<JohAR.AR.ReturnToReactBridge>() == null)
                    victoryBackButton.gameObject.AddComponent<JohAR.AR.ReturnToReactBridge>();

                victoryBackButton.onClick.RemoveAllListeners();
                victoryBackButton.onClick.AddListener(() => {
                    JohAR.AR.ReturnToReactBridge.ExecuteReturn();
                });
            }
        }
        else if (backButton != null)
        {
            backButton.gameObject.SetActive(true);
        }

        UpdateInstructionText(0,
            "Safe! Evacuation complete. Excellent work!",
            "सुरक्षित! निकासी पूरी हुई। बहुत बढ़िया!",
            "Nirapoy! Bahut badhiya!"
        );

        PlayVoiceover(DrillVoiceoverManager.DrillStep.Step6_Victory);
    }

    // =========================================================================
    // INPUT HELPER
    // =========================================================================

    private bool GetInputState(out bool isDown, out bool isHeld, out bool isUp, out Vector2 pos)
    {
        isDown = false;
        isHeld = false;
        isUp = false;
        pos = Vector2.zero;

#if ENABLE_INPUT_SYSTEM
        bool anyPressed = false;

        if (Touchscreen.current != null)
        {
            var touch = Touchscreen.current.primaryTouch;
            if (touch.press.isPressed || touch.press.wasPressedThisFrame || touch.press.wasReleasedThisFrame)
            {
                pos = touch.position.ReadValue();
                anyPressed = touch.press.isPressed;
                isDown = touch.press.wasPressedThisFrame || (anyPressed && !prevInputPressed);
                isHeld = anyPressed;
                isUp = touch.press.wasReleasedThisFrame || (!anyPressed && prevInputPressed);
                prevInputPressed = anyPressed;
                return true;
            }

            for (int i = 0; i < Touchscreen.current.touches.Count; i++)
            {
                var t = Touchscreen.current.touches[i];
                if (t.isInProgress || t.press.isPressed || t.press.wasPressedThisFrame)
                {
                    pos = t.position.ReadValue();
                    anyPressed = t.press.isPressed;
                    isDown = t.press.wasPressedThisFrame || (anyPressed && !prevInputPressed);
                    isHeld = anyPressed;
                    isUp = t.press.wasReleasedThisFrame || (!anyPressed && prevInputPressed);
                    prevInputPressed = anyPressed;
                    return true;
                }
            }
        }

        if (Pointer.current != null)
        {
            if (Pointer.current.press.isPressed || Pointer.current.press.wasPressedThisFrame || Pointer.current.press.wasReleasedThisFrame)
            {
                pos = Pointer.current.position.ReadValue();
                anyPressed = Pointer.current.press.isPressed;
                isDown = Pointer.current.press.wasPressedThisFrame || (anyPressed && !prevInputPressed);
                isHeld = anyPressed;
                isUp = Pointer.current.press.wasReleasedThisFrame || (!anyPressed && prevInputPressed);
                prevInputPressed = anyPressed;
                return true;
            }
        }

        if (Mouse.current != null)
        {
            if (Mouse.current.leftButton.isPressed || Mouse.current.leftButton.wasPressedThisFrame || Mouse.current.leftButton.wasReleasedThisFrame)
            {
                pos = Mouse.current.position.ReadValue();
                anyPressed = Mouse.current.leftButton.isPressed;
                isDown = Mouse.current.leftButton.wasPressedThisFrame || (anyPressed && !prevInputPressed);
                isHeld = anyPressed;
                isUp = Mouse.current.leftButton.wasReleasedThisFrame || (!anyPressed && prevInputPressed);
                prevInputPressed = anyPressed;
                return true;
            }
        }

        prevInputPressed = false;
        return false;
#else
        if (Input.touchCount > 0)
        {
            Touch t = Input.GetTouch(0);
            pos = t.position;
            if (t.phase == TouchPhase.Began) isDown = true;
            if (t.phase == TouchPhase.Began || t.phase == TouchPhase.Moved || t.phase == TouchPhase.Stationary) isHeld = true;
            if (t.phase == TouchPhase.Ended || t.phase == TouchPhase.Canceled) isUp = true;
            return true;
        }

        if (Input.GetMouseButtonDown(0))
        {
            isDown = true;
            isHeld = true;
            pos = Input.mousePosition;
            return true;
        }
        else if (Input.GetMouseButton(0))
        {
            isHeld = true;
            pos = Input.mousePosition;
            return true;
        }
        else if (Input.GetMouseButtonUp(0))
        {
            isUp = true;
            pos = Input.mousePosition;
            return true;
        }
        return false;
#endif
    }

    // =========================================================================
    // INSTRUCTION TEXT HELPERS
    // =========================================================================

    private void UpdateInstructionText(int stepIndex, string en, string hi, string sa)
    {
        LanguageManager.Language lang = LanguageManager.Instance != null
            ? LanguageManager.Instance.CurrentLanguage
            : LanguageManager.Language.English;

        if (instructionText != null)
        {
            switch (lang)
            {
                case LanguageManager.Language.Hindi: instructionText.text = hi; break;
                case LanguageManager.Language.Santali: instructionText.text = sa; break;
                default: instructionText.text = en; break;
            }
        }

        if (stepBadgeText != null)
        {
            if (stepIndex == 0)
            {
                stepBadgeText.text = "DRILL COMPLETE";
            }
            else
            {
                switch (lang)
                {
                    case LanguageManager.Language.Hindi: stepBadgeText.text = $"चरण {stepIndex}/3 (P.A.S.S.)"; break;
                    case LanguageManager.Language.Santali: stepBadgeText.text = $"ᱛᱷᱟᱯ {stepIndex}/3 (P.A.S.S.)"; break;
                    default: stepBadgeText.text = $"STEP {stepIndex}/3 (P.A.S.S.)"; break;
                }
            }
        }
    }

    private void UpdateInstructionText(string en, string hi, string sa, string badgeEn = "ACTIVE SIMULATION", string badgeHi = "सक्रिय सिमुलेशन", string badgeSa = "ᱥᱤᱢᱩᱞᱮᱥᱚᱱ")
    {
        LanguageManager.Language lang = LanguageManager.Instance != null
            ? LanguageManager.Instance.CurrentLanguage
            : LanguageManager.Language.English;

        if (instructionText != null)
        {
            switch (lang)
            {
                case LanguageManager.Language.Hindi: instructionText.text = hi; break;
                case LanguageManager.Language.Santali: instructionText.text = sa; break;
                default: instructionText.text = en; break;
            }
        }

        if (stepBadgeText != null)
        {
            switch (lang)
            {
                case LanguageManager.Language.Hindi: stepBadgeText.text = badgeHi; break;
                case LanguageManager.Language.Santali: stepBadgeText.text = badgeSa; break;
                default: stepBadgeText.text = badgeEn; break;
            }
        }
    }
}
