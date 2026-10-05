using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.IO;

public class ModernizeUI : EditorWindow
{
    // Modern Color Palette
    private static Color bgDark = new Color(0.06f, 0.09f, 0.16f, 1f); // Deep Slate
    private static Color primaryBlue = new Color(0.23f, 0.51f, 0.96f, 1f); // Vibrant Blue
    private static Color primaryRed = new Color(0.96f, 0.25f, 0.36f, 1f); // Vibrant Red/Orange
    private static Color glassBlack = new Color(0f, 0f, 0f, 0.6f); // Semi-transparent black

    [MenuItem("JohAR/Apply Modern UI Overhaul")]
    public static void ApplyOverhaul()
    {
        if (EditorApplication.isPlaying)
        {
            Debug.LogError("Cannot apply UI overhaul while in Play Mode.");
            return;
        }

        Sprite roundedSprite = CreateRoundedSprite();

        if (EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
        {
            ProcessScene("Assets/Scenes/0_Login.unity", roundedSprite, ApplyLoginUI);
            ProcessScene("Assets/Scenes/1_Home.unity", roundedSprite, ApplyHomeUI);
            ProcessScene("Assets/Scenes/2_FireSafetyAR.unity", roundedSprite, ApplyARUI);

            Debug.Log("<b>[UI Overhaul] Complete!</b> All scenes modernized.");
        }
    }

    static Sprite CreateRoundedSprite()
    {
        string path = "Assets/Sprites";
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);

        string texPath = path + "/RoundedPill.png";
        
        int size = 128;
        int r = 64; // Fully rounded edges (pill shape)
        Texture2D tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
        Color[] pixels = new Color[size * size];

        for (int y = 0; y < size; y++)
        {
            for (int x = 0; x < size; x++)
            {
                float dx = 0, dy = 0;
                if (x < r) dx = r - x;
                else if (x > size - r) dx = x - (size - r);
                
                if (y < r) dy = r - y;
                else if (y > size - r) dy = y - (size - r);

                float dist = Mathf.Sqrt(dx * dx + dy * dy);
                
                float alpha = Mathf.Clamp01(r - dist);
                pixels[y * size + x] = new Color(1, 1, 1, alpha);
            }
        }
        
        tex.SetPixels(pixels);
        tex.Apply();
        
        File.WriteAllBytes(texPath, tex.EncodeToPNG());
        AssetDatabase.ImportAsset(texPath, ImportAssetOptions.ForceUpdate);
        
        TextureImporter importer = AssetImporter.GetAtPath(texPath) as TextureImporter;
        if (importer != null)
        {
            importer.textureType = TextureImporterType.Sprite;
            importer.spriteBorder = new Vector4(64, 64, 64, 64); // 9-slicing
            importer.mipmapEnabled = false;
            importer.SaveAndReimport();
        }

        return AssetDatabase.LoadAssetAtPath<Sprite>(texPath);
    }

    static void ProcessScene(string scenePath, Sprite roundedSprite, System.Action<Scene, Sprite> stylingAction)
    {
        if (File.Exists(scenePath))
        {
            Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
            stylingAction(scene, roundedSprite);
            EditorSceneManager.SaveScene(scene, scenePath);
            Debug.Log($"Applied Modern UI to {scene.name}");
        }
        else
        {
            Debug.LogWarning($"Scene not found: {scenePath}");
        }
    }

    static void ApplyLoginUI(Scene scene, Sprite roundedSprite)
    {
        var canvas = Object.FindAnyObjectByType<Canvas>();
        if (canvas == null) return;

        // Set Background
        Image bg = GetOrCreateBackground(canvas.gameObject);
        bg.color = bgDark;

        // Style Title
        Text[] texts = Object.FindObjectsByType<Text>(FindObjectsInactive.Include);
        foreach (Text t in texts)
        {
            t.color = Color.white;
            if (t.fontSize > 40) // Likely the title
            {
                t.fontSize = 80;
                t.fontStyle = FontStyle.Bold;
                AddShadow(t.gameObject);
            }
        }

        // Style Buttons
        Button[] buttons = Object.FindObjectsByType<Button>(FindObjectsInactive.Include);
        foreach (Button btn in buttons)
        {
            Image btnImg = btn.GetComponent<Image>();
            if (btnImg != null)
            {
                btnImg.sprite = roundedSprite;
                btnImg.type = Image.Type.Sliced;
                btnImg.color = primaryBlue;
                AddShadow(btn.gameObject);
            }
            Text btnTxt = btn.GetComponentInChildren<Text>();
            if (btnTxt != null)
            {
                btnTxt.color = Color.white;
                btnTxt.fontStyle = FontStyle.Bold;
                btnTxt.fontSize = 45;
            }
        }

        // Style Input Fields
        InputField[] inputs = Object.FindObjectsByType<InputField>(FindObjectsInactive.Include);
        foreach (InputField input in inputs)
        {
            Image inputImg = input.GetComponent<Image>();
            if (inputImg != null)
            {
                inputImg.sprite = roundedSprite;
                inputImg.type = Image.Type.Sliced;
                inputImg.color = new Color(0.1f, 0.15f, 0.25f, 1f); // Darker panel
            }
            if (input.textComponent != null) input.textComponent.color = Color.white;
            if (input.placeholder != null) input.placeholder.GetComponent<Text>().color = new Color(1, 1, 1, 0.5f);
        }
    }

    static void ApplyHomeUI(Scene scene, Sprite roundedSprite)
    {
        var canvas = Object.FindAnyObjectByType<Canvas>();
        if (canvas == null) return;

        Image bg = GetOrCreateBackground(canvas.gameObject);
        bg.color = bgDark;

        Text[] texts = Object.FindObjectsByType<Text>(FindObjectsInactive.Include);
        foreach (Text t in texts)
        {
            t.color = Color.white;
            if (t.fontSize > 40)
            {
                t.fontSize = 75;
                t.fontStyle = FontStyle.Bold;
                AddShadow(t.gameObject);
            }
        }

        Button[] buttons = Object.FindObjectsByType<Button>(FindObjectsInactive.Include);
        foreach (Button btn in buttons)
        {
            Image btnImg = btn.GetComponent<Image>();
            if (btnImg != null)
            {
                btnImg.sprite = roundedSprite;
                btnImg.type = Image.Type.Sliced;
                // Make the big AR start button Red/Orange to stand out
                btnImg.color = btn.name.Contains("Start") ? primaryRed : primaryBlue;
                AddShadow(btn.gameObject);
                
                if (btn.name.Contains("Start"))
                {
                    RectTransform rt = btn.GetComponent<RectTransform>();
                    rt.sizeDelta = new Vector2(rt.sizeDelta.x * 1.1f, 180); // Make it taller/nicer
                }
            }
            Text btnTxt = btn.GetComponentInChildren<Text>();
            if (btnTxt != null)
            {
                btnTxt.color = Color.white;
                btnTxt.fontStyle = FontStyle.Bold;
                btnTxt.fontSize = 50;
            }
        }

        Dropdown[] dropdowns = Object.FindObjectsByType<Dropdown>(FindObjectsInactive.Include);
        foreach (Dropdown drop in dropdowns)
        {
            Image dropImg = drop.GetComponent<Image>();
            if (dropImg != null)
            {
                dropImg.sprite = roundedSprite;
                dropImg.type = Image.Type.Sliced;
                dropImg.color = new Color(0.15f, 0.2f, 0.3f, 1f);
            }
            if (drop.captionText != null) drop.captionText.color = Color.white;
        }
    }

    static void ApplyARUI(Scene scene, Sprite roundedSprite)
    {
        var canvas = Object.FindAnyObjectByType<Canvas>();
        if (canvas == null) return;

        // 1. Style Instruction Text into a Glass Panel
        GameObject instTextObj = GameObject.Find("InstructionText");
        if (instTextObj != null)
        {
            Text instText = instTextObj.GetComponent<Text>();
            instText.color = Color.white;
            instText.fontSize = 55;
            instText.fontStyle = FontStyle.Bold;
            instText.alignment = TextAnchor.MiddleCenter;
            AddShadow(instTextObj);

            // Create Glass Background Panel if it doesn't exist
            GameObject glassPanel = GameObject.Find("InstructionGlassPanel");
            if (glassPanel == null)
            {
                glassPanel = new GameObject("InstructionGlassPanel");
                glassPanel.transform.SetParent(canvas.transform);
                glassPanel.transform.SetSiblingIndex(0); // Send to back behind text
                
                Image img = glassPanel.AddComponent<Image>();
                img.sprite = roundedSprite;
                img.type = Image.Type.Sliced;
                img.color = glassBlack;
            }

            RectTransform glassRt = glassPanel.GetComponent<RectTransform>();
            RectTransform textRt = instTextObj.GetComponent<RectTransform>();

            // Anchor Glass Panel to Top Center
            glassRt.anchorMin = new Vector2(0.5f, 1f);
            glassRt.anchorMax = new Vector2(0.5f, 1f);
            glassRt.pivot = new Vector2(0.5f, 1f);
            glassRt.anchoredPosition = new Vector2(0, -80);
            glassRt.sizeDelta = new Vector2(900, 200);

            // Put Text inside Glass Panel
            textRt.SetParent(glassRt);
            textRt.anchorMin = new Vector2(0, 0);
            textRt.anchorMax = new Vector2(1, 1);
            textRt.pivot = new Vector2(0.5f, 0.5f);
            textRt.anchoredPosition = Vector2.zero;
            textRt.sizeDelta = new Vector2(-40, -40); // 20px padding
        }

        // 2. Style Back Button
        Button backBtn = Object.FindAnyObjectByType<Button>(FindObjectsInactive.Include); // Should be BackHomeButton
        if (backBtn != null && backBtn.gameObject.name == "BackHomeButton")
        {
            Image btnImg = backBtn.GetComponent<Image>();
            if (btnImg != null)
            {
                btnImg.sprite = roundedSprite;
                btnImg.type = Image.Type.Sliced;
                btnImg.color = primaryBlue;
                AddShadow(backBtn.gameObject);
            }

            Text btnTxt = backBtn.GetComponentInChildren<Text>();
            if (btnTxt != null)
            {
                btnTxt.color = Color.white;
                btnTxt.fontSize = 45;
                btnTxt.fontStyle = FontStyle.Bold;
            }

            RectTransform btnRt = backBtn.GetComponent<RectTransform>();
            btnRt.sizeDelta = new Vector2(500, 140);
        }
    }

    static Image GetOrCreateBackground(GameObject canvasObj)
    {
        GameObject bgObj = GameObject.Find("AppBackground");
        if (bgObj == null)
        {
            bgObj = new GameObject("AppBackground");
            bgObj.transform.SetParent(canvasObj.transform);
            bgObj.transform.SetSiblingIndex(0);
            
            RectTransform rt = bgObj.AddComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.sizeDelta = Vector2.zero;
            rt.anchoredPosition = Vector2.zero;
        }
        Image img = bgObj.GetComponent<Image>();
        if (img == null) img = bgObj.AddComponent<Image>();
        return img;
    }

    static void AddShadow(GameObject obj)
    {
        Shadow shadow = obj.GetComponent<Shadow>();
        if (shadow == null) shadow = obj.AddComponent<Shadow>();
        shadow.effectColor = new Color(0, 0, 0, 0.5f);
        shadow.effectDistance = new Vector2(0, -4);
    }
}
