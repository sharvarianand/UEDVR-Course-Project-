using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class HomeManager : MonoBehaviour
{
    [Header("Profile & Header")]
    public Text welcomeText;
    public Text roleBadgeText;
    public Button logoutButton;
    public Button langSwitchButton;
    public Text langSwitchButtonText;

    [Header("Module 1: Fire Safety")]
    public Text module1TitleText;
    public Text module1DescText;
    public Button startFireSafetyButton;
    public Text startFireSafetyButtonText;

    [Header("Module 2: Hazard Reporting")]
    public Text module2TitleText;
    public Text module2DescText;
    public Button reportHazardButton;
    public Text reportHazardButtonText;

    [Header("Module 3: Emergency SOS")]
    public Text module3TitleText;
    public Text module3DescText;
    public Button sosButton;
    public Text sosButtonText;

    [Header("Feedback Modal / Toast (Optional)")]
    public GameObject feedbackModal;
    public Text feedbackTitleText;
    public Text feedbackBodyText;
    public Button feedbackCloseButton;

    private float sceneLoadTime;

    private void Awake()
    {
        // Ensure Home Menu stays in Portrait mode
        Screen.autorotateToPortrait = true;
        Screen.autorotateToPortraitUpsideDown = false;
        Screen.autorotateToLandscapeLeft = false;
        Screen.autorotateToLandscapeRight = false;
        Screen.orientation = ScreenOrientation.Portrait;
    }

    private void Start()
    {
        sceneLoadTime = Time.time;
        UpdateUIForLanguage();

        // Ensure current worker profile is stored offline and synced
        string currentWorker = PlayerPrefs.GetString("WorkerID", "W-7042");
        LanguageManager.Language curLang = LanguageManager.Instance != null ? LanguageManager.Instance.CurrentLanguage : LanguageManager.Language.Hindi;
        JohAR.Data.OfflineSyncManager.Instance.RecordLogin(currentWorker, curLang);
        
        if (startFireSafetyButton != null)
            startFireSafetyButton.onClick.AddListener(OnStartFireSafety);

        if (reportHazardButton != null)
            reportHazardButton.onClick.AddListener(OnReportHazard);

        if (sosButton != null)
            sosButton.onClick.AddListener(OnSOS);

        if (logoutButton != null)
            logoutButton.onClick.AddListener(OnLogout);

        if (langSwitchButton != null)
            langSwitchButton.onClick.AddListener(OnCycleLanguage);

        if (feedbackCloseButton != null)
            feedbackCloseButton.onClick.AddListener(() => {
                if (feedbackModal != null) feedbackModal.SetActive(false);
            });
    }

    private void OnCycleLanguage()
    {
        LanguageManager.Language current = LanguageManager.Instance != null ? LanguageManager.Instance.CurrentLanguage : LanguageManager.Language.Hindi;
        LanguageManager.Language next = (LanguageManager.Language)(((int)current + 1) % 3);

        if (LanguageManager.Instance != null)
        {
            LanguageManager.Instance.SetLanguage(next);
        }
        else
        {
            PlayerPrefs.SetInt("Language", (int)next);
            PlayerPrefs.Save();
        }

        UpdateUIForLanguage();
    }

    private void UpdateUIForLanguage()
    {
        string workerId = PlayerPrefs.GetString("WorkerID", "W-7042");
        string workerName = PlayerPrefs.GetString("WorkerName", "Ramesh Soren");
        string workerRole = PlayerPrefs.GetString("WorkerRole", "Level 1 Safety Trainee");
        string workerSector = PlayerPrefs.GetString("WorkerSector", "Sector 4 Mine");

        // Check if this worker has completed the fire drill
        bool isDrillCompleted = JohAR.Data.OfflineDatabase.Instance.HasWorkerCompletedDrill(workerId, "FIRE_SAFETY_PASS") ||
                                PlayerPrefs.GetInt($"Drill_FireSafety_{workerId}", 0) == 1;

        float duration = 8.5f;
        int score = 100;
        int stars = 3;
        if (isDrillCompleted)
        {
            JohAR.Data.OfflineDatabase.Instance.GetWorkerDrillStats(workerId, "FIRE_SAFETY_PASS", out duration, out score, out stars);
            if (duration <= 0f) duration = PlayerPrefs.GetFloat($"Drill_FireSafety_Time_{workerId}", 8.5f);
            if (score <= 0) score = PlayerPrefs.GetInt($"Drill_FireSafety_Score_{workerId}", 100);
            if (stars <= 0) stars = 3;
        }

        LanguageManager.Language currentLang = LanguageManager.Instance != null ? LanguageManager.Instance.CurrentLanguage : LanguageManager.Language.Hindi;

        if (langSwitchButtonText != null)
        {
            langSwitchButtonText.color = new Color(0.12f, 0.16f, 0.24f, 1f); // Dark Charcoal
        }

        switch (currentLang)
        {
            case LanguageManager.Language.Hindi:
                if (welcomeText != null) welcomeText.text = $"नमस्ते, {workerName} ({workerId})!";
                if (roleBadgeText != null) 
                    roleBadgeText.text = isDrillCompleted
                        ? $"स्तर 1 सुरक्षा प्रशिक्षु • ✓ अग्नि सुरक्षा प्रमाणित • {workerSector}"
                        : $"स्तर 1 सुरक्षा प्रशिक्षु • ○ प्रशिक्षण लंबित • {workerSector}";
                
                if (langSwitchButtonText != null) langSwitchButtonText.text = "🌐 हिन्दी";

                if (module1TitleText != null) 
                    module1TitleText.text = isDrillCompleted 
                        ? "अग्नि सुरक्षा एवं अग्निशामक (AR) ✓ पूर्ण" 
                        : "अग्नि सुरक्षा एवं अग्निशामक (AR) [लंबित]";
                
                if (module1DescText != null) 
                    module1DescText.text = isDrillCompleted
                        ? $"✓ P.A.S.S. तकनीक प्रमाणित! (समय: {duration:F1}s • स्कोर: {score}/100 • ★★★)\nआप आवश्यकतानुसार कभी भी पुनः अभ्यास कर सकते हैं।"
                        : "P.A.S.S. तकनीक द्वारा आग बुझाने का 3D AR अभ्यास। सील तोड़ें, पिन निकालें और आग बुझाएं।";
                
                if (startFireSafetyButtonText != null) 
                    startFireSafetyButtonText.text = isDrillCompleted ? "पुनः अभ्यास करें ⟳" : "AR अभ्यास शुरू करें ▶";

                if (module2TitleText != null) module2TitleText.text = "खदान खतरा एवं गैस रिसाव रिपोर्टिंग";
                if (module2DescText != null) module2DescText.text = "खतरनाक गैस, भूस्खलन और मशीनरी खराबी की तुरंत रिपोर्ट सुरक्षा अधिकारी को दर्ज करें।";
                if (reportHazardButtonText != null) reportHazardButtonText.text = "खतरा दर्ज करें ⚠";

                if (module3TitleText != null) module3TitleText.text = "आपातकालीन SOS एवं निकासी सायरन";
                if (module3DescText != null) module3DescText.text = "खदान दुर्घटना की स्थिति में तुरंत रेस्क्यू टीम को अलर्ट और सायरन भेजें।";
                if (sosButtonText != null) sosButtonText.text = "🚨 आपातकालीन SOS";
                break;

            case LanguageManager.Language.Santali:
                if (welcomeText != null) welcomeText.text = $"Johar, {workerName} ({workerId})!";
                if (roleBadgeText != null) 
                    roleBadgeText.text = isDrillCompleted
                        ? $"ᱛᱷᱟᱨ 1 ᱨᱩᱠᱷᱤᱭᱟᱹ • ✓ ᱥᱮᱪᱮᱫ ᱯᱩᱨᱟᱹᱣ • {workerSector}"
                        : $"ᱛᱷᱟᱨ 1 ᱨᱩᱠᱷᱤᱭᱟᱹ • ○ ᱥᱮᱪᱮᱫ ᱵᱟᱹᱠᱤ • {workerSector}";
                
                if (langSwitchButtonText != null) langSwitchButtonText.text = "🌐 ᱥᱟᱱᱛᱟᱲᱤ";

                if (module1TitleText != null) 
                    module1TitleText.text = isDrillCompleted 
                        ? "ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ (AR) ✓ ᱯᱩᱨᱟᱹᱣ" 
                        : "ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ (AR) [ᱵᱟᱹᱠᱤ]";
                
                if (module1DescText != null) 
                    module1DescText.text = isDrillCompleted
                        ? $"✓ P.A.S.S. ᱦᱚᱨᱟ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ! (ᱚᱠᱛᱚ: {duration:F1}s • ᱥᱠᱳᱨ: {score}/100 • ★★★)\nᱫᱚᱲᱦᱟ ᱦᱮᱣᱟ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱢ᱾"
                        : "P.A.S.S. ᱦᱚᱨᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱨᱮᱱᱟᱜ 3D AR ᱦᱮᱣᱟ᱾ ᱥᱤᱞ ᱨᱟᱹᱯᱩᱫ ᱟᱨ ᱯᱤᱱ ᱚᱰᱚᱠ ᱢᱮ᱾";
                
                if (startFireSafetyButtonText != null) 
                    startFireSafetyButtonText.text = isDrillCompleted ? "ᱫᱚᱲᱦᱟ ᱦᱮᱣᱟ ᱢᱮ ⟳" : "AR ᱦᱮᱣᱟ ᱮᱦᱚᱵ ᱢᱮ ▶";

                if (module2TitleText != null) module2TitleText.text = "ᱠᱷᱟᱫᱟᱱ ᱵᱤᱯᱚᱫᱽ ᱟᱨ ᱜᱮᱥ ᱞᱤᱠ ᱠᱷᱚᱵᱚᱨ";
                if (module2DescText != null) module2DescText.text = "ᱵᱤᱥᱟᱹᱠᱛᱚ ᱜᱮᱥ, ᱫᱷᱟᱹᱥᱩᱨ ᱟᱨ ᱠᱚᱞ ᱠᱟᱹᱨᱠᱷᱟᱱᱟ ᱵᱟᱹᱲᱤᱡ ᱨᱮᱱᱟᱜ ᱠᱷᱚᱵᱚᱨ ᱮᱢ ᱢᱮ᱾";
                if (reportHazardButtonText != null) reportHazardButtonText.text = "ᱵᱤᱯᱚᱫᱽ ᱠᱷᱚᱵᱚᱨ ᱮᱢ ᱢᱮ ⚠";

                if (module3TitleText != null) module3TitleText.text = "ᱟᱹᱰᱤ ᱩᱥᱟᱹᱨᱟ SOS ᱟᱨ ᱚᱰᱚᱠ ᱥᱟᱭᱨᱮᱱ";
                if (module3DescText != null) module3DescText.text = "ᱵᱤᱯᱚᱫᱽ ᱚᱠᱛᱚ ᱨᱮ ᱨᱮᱥᱠᱤᱭᱩ ᱴᱤᱢ ᱴᱷᱮᱱ ᱞᱚᱜᱚᱱ ᱠᱷᱚᱵᱚᱨ ᱵᱷᱮᱡᱟᱭ ᱢᱮ᱾";
                if (sosButtonText != null) sosButtonText.text = "🚨 ᱞᱚᱜᱚᱱ SOS";
                break;

            case LanguageManager.Language.English:
            default:
                if (welcomeText != null) welcomeText.text = $"Welcome, {workerName} ({workerId})!";
                if (roleBadgeText != null) 
                    roleBadgeText.text = isDrillCompleted
                        ? $"Level 1 Safety Trainee • ✓ Fire Safety Certified • {workerSector}"
                        : $"Level 1 Safety Trainee • ○ Training Pending • {workerSector}";
                
                if (langSwitchButtonText != null) langSwitchButtonText.text = "🌐 English";

                if (module1TitleText != null) 
                    module1TitleText.text = isDrillCompleted 
                        ? "Fire Safety & Extinguisher (AR) ✓ CERTIFIED" 
                        : "Fire Safety & Extinguisher (AR) [PENDING]";
                
                if (module1DescText != null) 
                    module1DescText.text = isDrillCompleted
                        ? $"✓ P.A.S.S. Protocol Certified! (Time: {duration:F1}s • Score: {score}/100 • ★★★)\nYou may retake the AR drill anytime to refresh your training."
                        : "Interactive 3D AR drill using the P.A.S.S. protocol (Pull, Aim, Squeeze, Sweep).";
                
                if (startFireSafetyButtonText != null) 
                    startFireSafetyButtonText.text = isDrillCompleted ? "RETAKE AR DRILL ⟳" : "START AR SIMULATION ▶";

                if (module2TitleText != null) module2TitleText.text = "Hazard & Gas Leak Reporting";
                if (module2DescText != null) module2DescText.text = "Log toxic gas anomalies, structural fractures, and equipment faults.";
                if (reportHazardButtonText != null) reportHazardButtonText.text = "REPORT MINE HAZARD ⚠";

                if (module3TitleText != null) module3TitleText.text = "Emergency SOS & Evacuation";
                if (module3DescText != null) module3DescText.text = "Broadcast distress coordinates to mine rescue control center.";
                if (sosButtonText != null) sosButtonText.text = "🚨 TRIGGER SOS DISTRESS";
                break;
        }
    }

    private void OnStartFireSafety()
    {
        if (Time.time - sceneLoadTime < 0.5f) return; // Prevent accidental touch-through from scene transition

        // Switch to immersive Landscape mode for AR simulation
        Screen.autorotateToPortrait = false;
        Screen.autorotateToPortraitUpsideDown = false;
        Screen.autorotateToLandscapeLeft = true;
        Screen.autorotateToLandscapeRight = true;
        Screen.orientation = ScreenOrientation.LandscapeLeft;

        SceneManager.LoadScene("2_FireSafetyAR");
    }

    private void OnReportHazard()
    {
        JohAR.Data.OfflineSyncManager.Instance.RecordHazardReport(
            "Toxic Gas / Structural Anomaly",
            "Zone 4 Underground",
            "High",
            "Worker-reported hazard via JohAR Mobile Console.");

        bool isOnline = JohAR.Data.OfflineSyncManager.Instance.IsOnline;
        string syncStatus = isOnline 
            ? "✓ Transmitted & Synced to Mine Operations Dashboard" 
            : "💾 Stored Offline on Device (Will auto-sync when connected)";

        ShowFeedback("HAZARD REPORT LOGGED", 
            $"Incident recorded for Zone 4 Underground.\n\nDatabase: {syncStatus}\nSafety Officers have been alerted.");
    }

    private void OnSOS()
    {
        JohAR.Data.OfflineSyncManager.Instance.RecordSOSEvent(
            "Beacon-408",
            "Exit Shaft B / Zone 4");

        bool isOnline = JohAR.Data.OfflineSyncManager.Instance.IsOnline;
        string syncStatus = isOnline 
            ? "🚨 Transmitted to Rescue Center in Real-Time!" 
            : "💾 Stored Offline on Device (Broadcasting locally)";

        ShowFeedback("EMERGENCY SOS BROADCAST", 
            $"Distress signal activated!\nRescue Beacon #408 triggered.\n\nDatabase: {syncStatus}\n\nRemain calm and move toward Exit Shaft B.");
    }

    private void ShowFeedback(string title, string body)
    {
        if (feedbackModal != null)
        {
            if (feedbackTitleText != null) feedbackTitleText.text = title;
            if (feedbackBodyText != null) feedbackBodyText.text = body;
            feedbackModal.SetActive(true);
        }
        else
        {
            Debug.Log($"[HomeManager] {title}: {body}");
        }
    }

    private void OnLogout()
    {
        SceneManager.LoadScene("0_Login");
    }
}
