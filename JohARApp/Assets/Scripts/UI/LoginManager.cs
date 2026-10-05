using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LoginManager : MonoBehaviour
{
    [Header("UI References")]
    public InputField workerIdInput;
    public Button hindiButton;
    public Button santaliButton;
    public Button englishButton;
    public Button continueButton;
    public Button quickIdButton;

    [Header("Text Elements for Live Translation")]
    public Text headerSubtitleText;
    public Text languageSectionTitle;
    public Text workerIdSectionTitle;
    public Text continueButtonText;

    [Header("Kenney Button Sprites (Optional)")]
    public Sprite activeLangSprite;
    public Sprite inactiveLangSprite;

    [Header("Error / Validation Feedback")]
    public Text errorFeedbackText;

    private LanguageManager.Language selectedLanguage = LanguageManager.Language.Hindi;
    private static readonly string[] AuthorizedWorkerIds = { "W-7042", "W-4108", "W-5521", "W-1099", "W-8834" };
    private int quickIdIndex = 0;

    private void Awake()
    {
        // Ensure Login stays in Portrait mode
        Screen.autorotateToPortrait = true;
        Screen.autorotateToPortraitUpsideDown = false;
        Screen.autorotateToLandscapeLeft = false;
        Screen.autorotateToLandscapeRight = false;
        Screen.orientation = ScreenOrientation.Portrait;
    }

    private void Start()
    {
        // Load existing saved language if any
        if (PlayerPrefs.HasKey("Language"))
        {
            selectedLanguage = (LanguageManager.Language)PlayerPrefs.GetInt("Language", (int)LanguageManager.Language.Hindi);
        }

        // Load saved worker ID if any (must be valid authorized worker)
        if (workerIdInput != null)
        {
            string savedId = PlayerPrefs.GetString("WorkerID", "W-7042");
            if (!JohAR.Data.OfflineDatabase.Instance.IsWorkerRegistered(savedId))
            {
                savedId = "W-7042"; // Default to primary trainee
            }
            workerIdInput.text = savedId;
        }

        // Initialize error feedback text if not linked in scene
        EnsureErrorFeedbackText();

        if (hindiButton != null)
            hindiButton.onClick.AddListener(() => OnLanguageSelected(LanguageManager.Language.Hindi));
        
        if (santaliButton != null)
            santaliButton.onClick.AddListener(() => OnLanguageSelected(LanguageManager.Language.Santali));
        
        if (englishButton != null)
            englishButton.onClick.AddListener(() => OnLanguageSelected(LanguageManager.Language.English));

        if (continueButton != null)
            continueButton.onClick.AddListener(OnContinue);

        if (quickIdButton != null)
            quickIdButton.onClick.AddListener(OnQuickCycleId);

        UpdateUIForSelectedLanguage();
    }

    private void EnsureErrorFeedbackText()
    {
        if (errorFeedbackText != null) return;

        // Try to find existing
        var existing = GameObject.Find("ErrorFeedbackText");
        if (existing != null)
        {
            errorFeedbackText = existing.GetComponent<Text>();
            return;
        }

        // Dynamically create non-destructively under workerIdInput or Canvas
        if (workerIdInput != null)
        {
            GameObject errGo = new GameObject("ErrorFeedbackText");
            errGo.transform.SetParent(workerIdInput.transform.parent, false);
            errorFeedbackText = errGo.AddComponent<Text>();
            errorFeedbackText.font = workerIdInput.textComponent != null ? workerIdInput.textComponent.font : Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            errorFeedbackText.fontSize = 14;
            errorFeedbackText.alignment = TextAnchor.MiddleCenter;
            errorFeedbackText.color = new Color(0.95f, 0.25f, 0.25f, 1f);
            errorFeedbackText.fontStyle = FontStyle.Bold;

            RectTransform rt = errGo.GetComponent<RectTransform>();
            RectTransform inputRt = workerIdInput.GetComponent<RectTransform>();
            rt.anchorMin = inputRt.anchorMin;
            rt.anchorMax = inputRt.anchorMax;
            rt.pivot = inputRt.pivot;
            rt.sizeDelta = new Vector2(inputRt.sizeDelta.x, 36);
            rt.anchoredPosition = new Vector2(inputRt.anchoredPosition.x, inputRt.anchoredPosition.y - inputRt.sizeDelta.y - 14);
            errGo.SetActive(false);
        }
    }

    private void OnLanguageSelected(LanguageManager.Language lang)
    {
        selectedLanguage = lang;
        if (LanguageManager.Instance != null)
        {
            LanguageManager.Instance.SetLanguage(selectedLanguage);
        }
        else
        {
            PlayerPrefs.SetInt("Language", (int)selectedLanguage);
            PlayerPrefs.Save();
        }

        UpdateUIForSelectedLanguage();
    }

    private void OnQuickCycleId()
    {
        if (workerIdInput != null)
        {
            workerIdInput.text = AuthorizedWorkerIds[quickIdIndex];
            quickIdIndex = (quickIdIndex + 1) % AuthorizedWorkerIds.Length;
            HideError();
        }
    }

    private void OnContinue()
    {
        string rawInput = workerIdInput != null ? workerIdInput.text.Trim() : "";
        if (string.IsNullOrEmpty(rawInput))
        {
            ShowEmptyIdError();
            return;
        }

        string normalizedId = rawInput.ToUpperInvariant();

        // STRICT VALIDATION: Check if worker ID exists in database
        bool isRegistered = JohAR.Data.OfflineDatabase.Instance.IsWorkerRegistered(normalizedId);
        if (!isRegistered)
        {
            ShowUnregisteredError(normalizedId);
            return;
        }

        // Retrieve verified worker details
        var worker = JohAR.Data.OfflineDatabase.Instance.GetRegisteredWorker(normalizedId);
        string workerName = worker != null ? worker.name : "Miner " + normalizedId;
        string workerRole = worker != null ? worker.role : "Level 1 Safety Trainee";
        string workerSector = worker != null ? worker.sector : "Sector 4 Mine";

        PlayerPrefs.SetString("WorkerID", normalizedId);
        PlayerPrefs.SetString("WorkerName", workerName);
        PlayerPrefs.SetString("WorkerRole", workerRole);
        PlayerPrefs.SetString("WorkerSector", workerSector);
        PlayerPrefs.SetInt("Language", (int)selectedLanguage);
        PlayerPrefs.Save();

        if (LanguageManager.Instance != null)
        {
            LanguageManager.Instance.SetLanguage(selectedLanguage);
        }

        // Record verified worker login (never creates duplicate/random rows)
        JohAR.Data.OfflineSyncManager.Instance.RecordLogin(normalizedId, selectedLanguage);

        SceneManager.LoadScene("1_Home");
    }

    private void ShowEmptyIdError()
    {
        string msg;
        switch (selectedLanguage)
        {
            case LanguageManager.Language.Hindi:
                msg = "⚠ कृपया अपनी पंजीकृत कर्मचारी संख्या दर्ज करें (जैसे W-7042)";
                break;
            case LanguageManager.Language.Santali:
                msg = "⚠ ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱨᱮᱡᱤᱥᱴᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ID ᱮᱢ ᱢᱮ (W-7042)";
                break;
            default:
                msg = "⚠ Please enter your registered Worker ID (e.g., W-7042)";
                break;
        }
        DisplayErrorMessage(msg);
    }

    private void ShowUnregisteredError(string attemptedId)
    {
        string msg;
        switch (selectedLanguage)
        {
            case LanguageManager.Language.Hindi:
                msg = $"अमान्य पहचान: \"{attemptedId}\" पंजीकृत नहीं है।\nकेवल अधिकृत खनिक: W-7042, W-4108, W-5521, W-1099, W-8834";
                break;
            case LanguageManager.Language.Santali:
                msg = $"ᱵᱟᱝ ᱩᱯᱨᱩᱢ: \"{attemptedId}\" ᱵᱟᱝ ᱨᱮᱡᱤᱥᱴᱟᱨ ᱟᱠᱟᱱᱟ᱾\nᱠᱟᱹᱢᱤᱭᱟᱹ ID: W-7042, W-4108, W-5521, W-1099, W-8834";
                break;
            default:
                msg = $"Access Denied: \"{attemptedId}\" is not registered.\nAuthorized Miners: W-7042, W-4108, W-5521, W-1099, W-8834";
                break;
        }
        DisplayErrorMessage(msg);
    }

    private void DisplayErrorMessage(string message)
    {
        EnsureErrorFeedbackText();
        if (errorFeedbackText != null)
        {
            errorFeedbackText.text = message;
            errorFeedbackText.gameObject.SetActive(true);
        }
        else
        {
            Debug.LogError($"[LoginManager] {message}");
        }
    }

    private void HideError()
    {
        if (errorFeedbackText != null)
        {
            errorFeedbackText.gameObject.SetActive(false);
        }
    }

    private void UpdateUIForSelectedLanguage()
    {
        UpdateLanguageButtonVisuals();

        switch (selectedLanguage)
        {
            case LanguageManager.Language.Hindi:
                if (headerSubtitleText != null) headerSubtitleText.text = "औद्योगिक सुरक्षा एवं खनन प्रशिक्षण";
                if (languageSectionTitle != null) languageSectionTitle.text = "भाषा का चयन करें";
                if (workerIdSectionTitle != null) workerIdSectionTitle.text = "कर्मचारी पहचान संख्या (Worker ID)";
                if (continueButtonText != null) continueButtonText.text = "प्रशिक्षण शुरू करें";
                break;

            case LanguageManager.Language.Santali:
                if (headerSubtitleText != null) headerSubtitleText.text = "ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱢᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ";
                if (languageSectionTitle != null) languageSectionTitle.text = "ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ";
                if (workerIdSectionTitle != null) workerIdSectionTitle.text = "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ (Worker ID)";
                if (continueButtonText != null) continueButtonText.text = "ᱞᱟᱦᱟᱜ ᱢᱮ";
                break;

            case LanguageManager.Language.English:
            default:
                if (headerSubtitleText != null) headerSubtitleText.text = "Industrial Safety & Mine Hazard Training";
                if (languageSectionTitle != null) languageSectionTitle.text = "SELECT LANGUAGE";
                if (workerIdSectionTitle != null) workerIdSectionTitle.text = "WORKER CREDENTIALS";
                if (continueButtonText != null) continueButtonText.text = "CONTINUE TO TRAINING";
                break;
        }
    }

    private void UpdateLanguageButtonVisuals()
    {
        SetButtonActiveState(hindiButton, selectedLanguage == LanguageManager.Language.Hindi);
        SetButtonActiveState(santaliButton, selectedLanguage == LanguageManager.Language.Santali);
        SetButtonActiveState(englishButton, selectedLanguage == LanguageManager.Language.English);
    }

    private void SetButtonActiveState(Button btn, bool isActive)
    {
        if (btn == null) return;

        Image img = btn.GetComponent<Image>();
        if (img != null)
        {
            if (activeLangSprite != null && inactiveLangSprite != null)
            {
                img.sprite = isActive ? activeLangSprite : inactiveLangSprite;
                img.color = Color.white;
            }
            else
            {
                img.color = isActive ? new Color(0.15f, 0.68f, 0.38f, 1f) : new Color(0.25f, 0.3f, 0.4f, 0.9f);
            }
        }

        Text txt = btn.GetComponentInChildren<Text>();
        if (txt != null)
        {
            txt.color = isActive ? Color.white : new Color(0.12f, 0.16f, 0.24f, 1f);
            txt.fontStyle = FontStyle.Bold;
        }
    }
}
