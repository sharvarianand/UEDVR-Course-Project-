using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LoginManager : MonoBehaviour
{
    public InputField workerIdInput;
    public Button hindiButton;
    public Button santaliButton;
    public Button englishButton;
    
    private LanguageManager.Language selectedLanguage = LanguageManager.Language.Hindi;

    private void Start()
    {
        hindiButton.onClick.AddListener(() => OnLanguageSelected(LanguageManager.Language.Hindi));
        santaliButton.onClick.AddListener(() => OnLanguageSelected(LanguageManager.Language.Santali));
        englishButton.onClick.AddListener(() => OnLanguageSelected(LanguageManager.Language.English));
        
        UpdateButtonColors();
    }
    
    private void OnLanguageSelected(LanguageManager.Language lang)
    {
        selectedLanguage = lang;
        UpdateButtonColors();
        
        // Auto-login on language selection (since it's a prototype)
        if (string.IsNullOrEmpty(workerIdInput.text))
        {
            workerIdInput.text = "Worker_" + Random.Range(1000, 9999);
        }
        
        if (LanguageManager.Instance != null)
        {
            LanguageManager.Instance.SetLanguage(selectedLanguage);
        }

        PlayerPrefs.SetString("WorkerID", workerIdInput.text);
        PlayerPrefs.Save();

        SceneManager.LoadScene("1_Home");
    }
    
    private void UpdateButtonColors()
    {
        hindiButton.GetComponent<Image>().color = selectedLanguage == LanguageManager.Language.Hindi ? Color.green : Color.white;
        santaliButton.GetComponent<Image>().color = selectedLanguage == LanguageManager.Language.Santali ? Color.green : Color.white;
        englishButton.GetComponent<Image>().color = selectedLanguage == LanguageManager.Language.English ? Color.green : Color.white;
    }
}
