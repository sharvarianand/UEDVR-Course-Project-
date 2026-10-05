using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class HomeManager : MonoBehaviour
{
    public Text welcomeText;
    public Button startFireSafetyButton;
    public Button reportHazardButton;
    public Button sosButton;

    private void Start()
    {
        UpdateUIForLanguage();
        
        startFireSafetyButton.onClick.AddListener(OnStartFireSafety);
        reportHazardButton.onClick.AddListener(OnReportHazard);
        sosButton.onClick.AddListener(OnSOS);
    }

    private void UpdateUIForLanguage()
    {
        string workerId = PlayerPrefs.GetString("WorkerID", "User");
        LanguageManager.Language currentLang = LanguageManager.Instance != null ? LanguageManager.Instance.CurrentLanguage : LanguageManager.Language.Hindi;

        switch (currentLang)
        {
            case LanguageManager.Language.Hindi:
                welcomeText.text = $"नमस्ते, {workerId}!";
                break;
            case LanguageManager.Language.Santali:
                welcomeText.text = $"Johar, {workerId}!";
                break;
            case LanguageManager.Language.English:
                welcomeText.text = $"Hello, {workerId}!";
                break;
        }
    }

    private void OnStartFireSafety()
    {
        SceneManager.LoadScene("2_FireSafetyAR");
    }

    private void OnReportHazard()
    {
        Debug.Log("Hazard Reporting Not Implemented Yet");
    }

    private void OnSOS()
    {
        Debug.Log("SOS Triggered");
    }
}
