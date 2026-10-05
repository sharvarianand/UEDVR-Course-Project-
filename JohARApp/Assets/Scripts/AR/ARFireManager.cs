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
    [Header("Prefabs")]
    public GameObject firePrefab;
    public GameObject extinguisherPrefab;

    [Header("UI")]
    public Text instructionText;
    
    // Internal state
    private ARRaycastManager arRaycastManager;
    private ARPlaneManager arPlaneManager;
    private GameObject spawnedFire;
    private GameObject spawnedExtinguisher;
    private ExtinguisherController extinguisherController;
    private bool fireSpawned = false;
    private bool fireExtinguished = false;
    private bool isSpraying = false;

    // Swipe tracking for pin
    private Vector2 touchStartPos;
    private bool isTouchingPin = false;

    // Fire references
    private ParticleSystem[] fireParticles;
    private Light fireLight;
    private float[] originalEmissionRates;
    private float fireHealth = 1f;

    // UI buttons found at runtime
    private Button backButton;

    static List<ARRaycastHit> hits = new List<ARRaycastHit>();

    private Camera arCamera;

    void Awake()
    {
        arRaycastManager = GetComponent<ARRaycastManager>();
        if (arRaycastManager == null)
            arRaycastManager = GetComponentInParent<ARRaycastManager>();
        if (arRaycastManager == null)
            arRaycastManager = FindAnyObjectByType<ARRaycastManager>();

        arPlaneManager = GetComponent<ARPlaneManager>();
        if (arPlaneManager == null)
            arPlaneManager = FindAnyObjectByType<ARPlaneManager>();

        arCamera = Camera.main;
        if (arCamera == null)
            arCamera = FindAnyObjectByType<Camera>();
    }

    void Start()
    {
        if (arCamera == null)
            arCamera = Camera.main != null ? Camera.main : FindAnyObjectByType<Camera>();

        // Ensure EventSystem has an input module for the Back Button at the end
        var eventSystem = FindAnyObjectByType<UnityEngine.EventSystems.EventSystem>();
        if (eventSystem != null && eventSystem.GetComponent<UnityEngine.EventSystems.BaseInputModule>() == null)
        {
#if ENABLE_INPUT_SYSTEM
            eventSystem.gameObject.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
            eventSystem.gameObject.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
#endif
            Debug.Log("[ARFireManager] Injected missing InputModule into EventSystem.");
        }

        // Find back button
        var allButtons = FindObjectsByType<Button>(FindObjectsInactive.Include);
        foreach (var btn in allButtons)
        {
            if (btn.gameObject.name == "BackHomeButton")
            {
                backButton = btn;
                backButton.onClick.RemoveAllListeners();
                backButton.onClick.AddListener(() => SceneManager.LoadScene("1_Home"));
                backButton.gameObject.SetActive(false);
            }
        }

        UpdateInstructionText("Tap on the floor to spawn fire",
            "जमीन पर टैप करें आग लगाने के लिए",
            "Sengel lagao lagit ote re tap me");
    }

    void Update()
    {
        if (!fireSpawned)
        {
            HandleTapToSpawnFire();
            return;
        }

        if (fireSpawned && !fireExtinguished)
        {
            HandleTapOnExtinguisher();
            HandleExtinguishing();
        }
    }

    bool GetInputState(out bool isDown, out bool isHeld, out bool isUp, out Vector2 pos)
    {
        isDown = false;
        isHeld = false;
        isUp = false;
        pos = Vector2.zero;

#if ENABLE_INPUT_SYSTEM
        if (Touchscreen.current != null)
        {
            var touch = Touchscreen.current.primaryTouch;
            if (touch.press.isPressed || touch.press.wasPressedThisFrame || touch.press.wasReleasedThisFrame)
            {
                pos = touch.position.ReadValue();
                isDown = touch.press.wasPressedThisFrame;
                isHeld = touch.press.isPressed;
                isUp = touch.press.wasReleasedThisFrame;
                return true;
            }
        }
        
        if (Mouse.current != null)
        {
            if (Mouse.current.leftButton.isPressed || Mouse.current.leftButton.wasPressedThisFrame || Mouse.current.leftButton.wasReleasedThisFrame)
            {
                pos = Mouse.current.position.ReadValue();
                isDown = Mouse.current.leftButton.wasPressedThisFrame;
                isHeld = Mouse.current.leftButton.isPressed;
                isUp = Mouse.current.leftButton.wasReleasedThisFrame;
                return true;
            }
        }

        if (Pointer.current != null)
        {
            if (Pointer.current.press.isPressed || Pointer.current.press.wasPressedThisFrame || Pointer.current.press.wasReleasedThisFrame)
            {
                pos = Pointer.current.position.ReadValue();
                isDown = Pointer.current.press.wasPressedThisFrame;
                isHeld = Pointer.current.press.isPressed;
                isUp = Pointer.current.press.wasReleasedThisFrame;
                return true;
            }
        }
#else
        if (Input.touchCount > 0)
        {
            UnityEngine.Touch t = Input.GetTouch(0);
            pos = t.position;
            if (t.phase == UnityEngine.TouchPhase.Began) isDown = true;
            if (t.phase == UnityEngine.TouchPhase.Began || t.phase == UnityEngine.TouchPhase.Moved || t.phase == UnityEngine.TouchPhase.Stationary) isHeld = true;
            if (t.phase == UnityEngine.TouchPhase.Ended || t.phase == UnityEngine.TouchPhase.Canceled) isUp = true;
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
#endif
        return false;
    }

    void HandleTapToSpawnFire()
    {
        if (arRaycastManager == null)
            arRaycastManager = FindAnyObjectByType<ARRaycastManager>();

        bool isDown, isHeld, isUp;
        Vector2 touchPos;
        if (!GetInputState(out isDown, out isHeld, out isUp, out touchPos)) return;
        if (!isDown) return;

        if (arRaycastManager != null && arRaycastManager.Raycast(touchPos, hits, TrackableType.PlaneWithinPolygon | TrackableType.PlaneEstimated | TrackableType.PlaneWithinBounds))
        {
            SpawnFire(hits[0].pose);
        }
        else
        {
            Camera cam = arCamera != null ? arCamera : Camera.main;
            if (cam == null) cam = FindAnyObjectByType<Camera>();
            if (cam != null)
            {
                Ray ray = cam.ScreenPointToRay(touchPos);
                RaycastHit hit;
                if (Physics.Raycast(ray, out hit, 10f))
                {
                    SpawnFire(new Pose(hit.point, Quaternion.identity));
                }
                else if (Application.isEditor)
                {
                    Vector3 spawnPos = cam.transform.position + cam.transform.forward * 1.5f + Vector3.down * 0.5f;
                    SpawnFire(new Pose(spawnPos, Quaternion.identity));
                }
            }
        }
    }

    void HandleTapOnExtinguisher()
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

        // 1. Raycast Hits
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

        // 2. Screen-Space Proximity (Crucial for reliable mobile AR touch)
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

        // Generous touch radius (35% of screen width or 280px minimum)
        float touchRadius = Mathf.Max(Screen.width * 0.35f, 280f);

        // ==========================================
        // STATE 1: REMOVE SEAL
        // ==========================================
        if (!extinguisherController.isSealRemoved)
        {
            if (isDown)
            {
                // Trigger if tapped directly, or tapped near seal on screen, or tapped extinguisher top
                if (hitSealDirect || distToSeal < touchRadius || (hitExtinguisherDirect && hitPoint.y > extinguisherController.transform.position.y) || distToExt < touchRadius)
                {
                    extinguisherController.RemoveSeal();
                    UpdateInstructionText("Slide or tap the pin to pull it out.",
                        "पिन को बाहर निकालने के लिए उस पर स्लाइड या टैप करें।",
                        "Pin ocog lagit slide se tap me.");
                }
            }
            return;
        }

        // ==========================================
        // STATE 2: PULL PIN
        // ==========================================
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
                if (swipeDist > 30f) // Swiped across
                {
                    extinguisherController.RemovePin();
                    isTouchingPin = false;
                    UpdateInstructionText("Tap and hold the extinguisher to SPRAY and move close to fire.",
                        "आग लगी है! Extinguisher को दबाकर रखें और आग के पास जाएं।",
                        "Sengel lagao akana! Extinguisher lin ar sengel tala jao.");
                }
            }

            if (isUp && isTouchingPin)
            {
                // Also trigger if tapped directly and released
                extinguisherController.RemovePin();
                isTouchingPin = false;
                UpdateInstructionText("Tap and hold the extinguisher to SPRAY and move close to fire.",
                    "आग लगी है! Extinguisher को दबाकर रखें और आग के पास जाएं।",
                    "Sengel lagao akana! Extinguisher lin ar sengel tala jao.");
            }

            return;
        }

        // ==========================================
        // STATE 3: SPRAYING
        // ==========================================
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

    void SetSpray(bool state)
    {
        if (isSpraying == state) return;
        
        isSpraying = state;
        Debug.Log("[ARFireManager] 3D SPRAY: " + isSpraying);

        if (extinguisherController != null)
        {
            if (isSpraying)
                extinguisherController.StartSpray();
            else
                extinguisherController.StopSpray();
        }

        if (isSpraying)
        {
            UpdateInstructionText("Spraying! Move closer to the fire!",
                "स्प्रे कर रहे हैं! आग के पास जाएं!",
                "Spray ho raha! Sengel tala jao!");
        }
        else
        {
            UpdateInstructionText("Tap and hold the extinguisher to SPRAY and move close to fire.",
                "आग लगी है! Extinguisher को दबाकर रखें और आग के पास जाएं।",
                "Sengel lagao akana! Extinguisher lin ar sengel tala jao.");
        }
    }

    void SpawnFire(Pose pose)
    {
        if (firePrefab == null) return;

        spawnedFire = Instantiate(firePrefab, pose.position, Quaternion.identity);
        fireSpawned = true;
        fireHealth = 1f;

        fireParticles = spawnedFire.GetComponentsInChildren<ParticleSystem>();
        fireLight = spawnedFire.GetComponentInChildren<Light>();
        
        if (fireParticles != null && fireParticles.Length > 0)
        {
            originalEmissionRates = new float[fireParticles.Length];
            for (int i = 0; i < fireParticles.Length; i++)
                originalEmissionRates[i] = fireParticles[i].emission.rateOverTime.constant;
        }

        try
        {
            if (extinguisherPrefab != null)
            {
                spawnedExtinguisher = Instantiate(extinguisherPrefab);
            }
            
            if (spawnedExtinguisher == null)
            {
                Debug.LogWarning("[ARFireManager] Spawning fallback extinguisher!");
                spawnedExtinguisher = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                spawnedExtinguisher.name = "FallbackExtinguisher";
                spawnedExtinguisher.transform.localScale = new Vector3(0.15f, 0.35f, 0.15f);
                spawnedExtinguisher.GetComponent<Renderer>().material.color = Color.red;
                
                // Add required components
                spawnedExtinguisher.AddComponent<ExtinguisherController>();
            }

            extinguisherController = spawnedExtinguisher.GetComponent<ExtinguisherController>();
            if (extinguisherController != null)
                extinguisherController.SetFireTarget(spawnedFire.transform);
        }
        catch (System.Exception e)
        {
            Debug.LogError("[ARFireManager] Error spawning extinguisher: " + e.Message);
        }
        finally
        {
            UpdateInstructionText("Tap the yellow seal to remove it.",
                "पीले सील पर टैप करके उसे निकालें।",
                "Sasang seal tap kate ocog me.");
        }
    }

    void HandleExtinguishing()
    {
        if (extinguisherController == null) return;

        if (isSpraying && spawnedFire != null)
        {
            float distance = Vector3.Distance(
                extinguisherController.transform.position,
                spawnedFire.transform.position);

            if (distance <= 1.5f)
            {
                float effectMultiplier = 1f - (distance / 1.5f);
                fireHealth -= 0.4f * effectMultiplier * Time.deltaTime;
                fireHealth = Mathf.Clamp01(fireHealth);
            }
        }

        UpdateFireVisuals(fireHealth);

        if (fireHealth <= 0f)
            OnFireExtinguished();
    }

    void UpdateFireVisuals(float health)
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
            fireLight.intensity = 2f * health;

        if (spawnedFire != null)
            spawnedFire.transform.localScale = Vector3.one * Mathf.Lerp(0.3f, 1f, health);
    }

    void OnFireExtinguished()
    {
        fireExtinguished = true;
        isSpraying = false;

        if (fireParticles != null)
            foreach (var ps in fireParticles) ps.Stop();
        if (fireLight != null) fireLight.enabled = false;
        if (extinguisherController != null) extinguisherController.StopSpray();
        if (spawnedFire != null) Destroy(spawnedFire, 1f);
        if (spawnedExtinguisher != null) Destroy(spawnedExtinguisher, 2f);

        if (backButton != null) backButton.gameObject.SetActive(true);

        UpdateInstructionText("Safe! Fire extinguished. Well done!",
            "सुरक्षित! आग बुझ गई। बहुत बढ़िया!",
            "Nirapoy! Sengel ibij ena. Bahut badhiya!");
    }
    
    // Keep to avoid Unity Event errors if any old script still references this
    void UpdateInstructionText(string en, string hi, string sa)
    {
        if (instructionText == null) return;
        LanguageManager.Language lang = LanguageManager.Instance != null
            ? LanguageManager.Instance.CurrentLanguage
            : LanguageManager.Language.English;
        switch (lang)
        {
            case LanguageManager.Language.Hindi: instructionText.text = hi; break;
            case LanguageManager.Language.Santali: instructionText.text = sa; break;
            default: instructionText.text = en; break;
        }
    }
}
