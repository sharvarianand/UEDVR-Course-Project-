using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.EventSystems;

#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem.UI;
#endif

public class FixUIScenes
{
    [MenuItem("JohAR/Fix UI Scenes")]
    public static void Fix()
    {
        string[] scenePaths = {
            "Assets/Scenes/0_Login.unity",
            "Assets/Scenes/1_Home.unity",
            "Assets/Scenes/2_FireSafetyAR.unity"
        };

        foreach (var path in scenePaths)
        {
            Scene scene = EditorSceneManager.OpenScene(path, OpenSceneMode.Single);
            
            // Fix Canvases
            Canvas[] canvases = Object.FindObjectsByType<Canvas>(FindObjectsInactive.Include);
            foreach (var canvas in canvases)
            {
                CanvasScaler scaler = canvas.GetComponent<CanvasScaler>();
                if (scaler != null)
                {
                    scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                    scaler.referenceResolution = new Vector2(1080, 1920);
                }
            }

            // Fix Input Modules
            EventSystem[] eventSystems = Object.FindObjectsByType<EventSystem>(FindObjectsInactive.Include);
            foreach (var es in eventSystems)
            {
                var standalone = es.GetComponent<StandaloneInputModule>();
                if (standalone != null)
                {
                    Object.DestroyImmediate(standalone);
                }
                
                #if ENABLE_INPUT_SYSTEM
                if (es.GetComponent<InputSystemUIInputModule>() == null)
                {
                    es.gameObject.AddComponent<InputSystemUIInputModule>();
                }
                #else
                if (es.GetComponent<StandaloneInputModule>() == null)
                {
                    es.gameObject.AddComponent<StandaloneInputModule>();
                }
                #endif
            }

            // Specific fixes for Login Scene
            if (scene.name == "0_Login")
            {
                InputField inputField = Object.FindAnyObjectByType<InputField>();
                if (inputField != null)
                {
                    RectTransform rt = inputField.GetComponent<RectTransform>();
                    rt.sizeDelta = new Vector2(600, 120);
                    rt.anchoredPosition = new Vector2(0, 100);
                    
                    Text textComponent = inputField.textComponent;
                    if (textComponent != null) textComponent.fontSize = 48;
                    
                    Text placeholder = inputField.placeholder as Text;
                    if (placeholder != null) placeholder.fontSize = 48;
                }

                Dropdown dropdown = Object.FindAnyObjectByType<Dropdown>();
                if (dropdown != null)
                {
                    RectTransform rt = dropdown.GetComponent<RectTransform>();
                    rt.sizeDelta = new Vector2(600, 100);
                    rt.anchoredPosition = new Vector2(0, -50);
                    
                    Text caption = dropdown.captionText;
                    if (caption != null) caption.fontSize = 40;
                    
                    Text itemText = dropdown.itemText;
                    if (itemText != null) itemText.fontSize = 40;
                }

                Button loginBtn = Object.FindAnyObjectByType<Button>();
                if (loginBtn != null && loginBtn.name == "LoginButton")
                {
                    RectTransform rt = loginBtn.GetComponent<RectTransform>();
                    rt.sizeDelta = new Vector2(400, 120);
                    rt.anchoredPosition = new Vector2(0, -250);
                    
                    Text btnText = loginBtn.GetComponentInChildren<Text>();
                    if (btnText != null) btnText.fontSize = 48;
                }
                
                Text title = Object.FindAnyObjectByType<Text>();
                if (title != null && title.name == "TitleText")
                {
                    title.fontSize = 120;
                    title.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 400);
                }
            }

            // Specific fixes for Home Scene
            if (scene.name == "1_Home")
            {
                Button[] buttons = Object.FindObjectsByType<Button>(FindObjectsInactive.Include);
                foreach (var btn in buttons)
                {
                    RectTransform rt = btn.GetComponent<RectTransform>();
                    rt.sizeDelta = new Vector2(800, 120);
                    
                    Text btnText = btn.GetComponentInChildren<Text>();
                    if (btnText != null) btnText.fontSize = 48;
                }

                Text wText = Object.FindAnyObjectByType<Text>();
                if (wText != null && wText.name == "WelcomeText")
                {
                    wText.fontSize = 80;
                    wText.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 500);
                }
                
                // Adjust button positions
                if (buttons.Length >= 3)
                {
                    buttons[0].GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 150);
                    buttons[1].GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 0);
                    buttons[2].GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -150);
                }
            }

            // Specific fixes for AR Scene
            if (scene.name == "2_FireSafetyAR")
            {
                Button[] buttons = Object.FindObjectsByType<Button>(FindObjectsInactive.Include);
                foreach (var btn in buttons)
                {
                    RectTransform rt = btn.GetComponent<RectTransform>();
                    rt.sizeDelta = new Vector2(400, 120);
                    
                    Text btnText = btn.GetComponentInChildren<Text>();
                    if (btnText != null) btnText.fontSize = 48;
                }

                Text arInstText = null;
                Text[] texts = Object.FindObjectsByType<Text>(FindObjectsInactive.Include);
                foreach(var t in texts)
                {
                    if (t.name == "InstructionText") arInstText = t;
                }
                
                if (arInstText != null)
                {
                    arInstText.fontSize = 60;
                    arInstText.GetComponent<RectTransform>().sizeDelta = new Vector2(1000, 200);
                    arInstText.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -100);
                }
                
                // Fix Extinguisher panel size
                var fireManager = Object.FindAnyObjectByType<ARFireManager>();
                // We no longer have an extinguisherPanel in ARFireManager, so we don't resize it here.
            }

            EditorSceneManager.SaveScene(scene, path);
        }

        Debug.Log("Successfully fixed all UI scaling and Input Modules!");
    }
}
