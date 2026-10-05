using UnityEngine;

public class LanguageManager : MonoBehaviour
{
    public static LanguageManager Instance { get; private set; }

    public enum Language { Hindi, Santali, English }
    public Language CurrentLanguage { get; private set; }

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            LoadLanguage();
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public void SetLanguage(Language lang)
    {
        CurrentLanguage = lang;
        PlayerPrefs.SetInt("Language", (int)lang);
        PlayerPrefs.Save();
    }

    private void LoadLanguage()
    {
        CurrentLanguage = (Language)PlayerPrefs.GetInt("Language", (int)Language.Hindi);
    }
}
