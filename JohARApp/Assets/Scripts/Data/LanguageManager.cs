using UnityEngine;

public class LanguageManager : MonoBehaviour
{
    private static LanguageManager _instance;
    public static LanguageManager Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = FindAnyObjectByType<LanguageManager>();
                if (_instance == null)
                {
                    GameObject go = new GameObject("[JohAR_LanguageManager]");
                    _instance = go.AddComponent<LanguageManager>();
                    DontDestroyOnLoad(go);
                    _instance.LoadLanguage();
                }
            }
            return _instance;
        }
    }

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    private static void AutoInitialize()
    {
        _ = Instance;
    }

    public enum Language { Hindi, Santali, English }
    public Language CurrentLanguage { get; private set; }

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
            LoadLanguage();
        }
        else if (_instance != this)
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
