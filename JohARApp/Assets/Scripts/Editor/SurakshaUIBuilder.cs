using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.IO;

public class SurakshaUIBuilder : EditorWindow
{
    // Color Palette based on mockups
    static Color bgDark = new Color(0.12f, 0.16f, 0.22f, 1f); // #1E293B
    static Color panelDark = new Color(0.17f, 0.22f, 0.31f, 0.9f); // #2D3748
    static Color accentOrange = new Color(0.96f, 0.6f, 0.15f, 1f); // #F69926
    static Color textWhite = new Color(0.95f, 0.95f, 0.95f, 1f);
    static Color textGray = new Color(0.6f, 0.65f, 0.7f, 1f);
    static Color inputBg = new Color(0.1f, 0.13f, 0.18f, 1f);
    static Color outlineColor = new Color(0.3f, 0.35f, 0.45f, 1f);

    [MenuItem("JohAR/Build SURAKSHA-AR UI")]
    public static void BuildUI()
    {
        if (EditorApplication.isPlaying)
        {
            Debug.LogError("Cannot build UI in Play Mode.");
            return;
        }

        Sprite roundedSprite = CreateRoundedSprite(64, "RoundedPill");
        Sprite cardSprite = CreateRoundedSprite(32, "RoundedCard");

        if (EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
        {
            ProcessScene("Assets/Scenes/0_Login.unity", roundedSprite, cardSprite, BuildLoginScene);
            ProcessScene("Assets/Scenes/1_Home.unity", roundedSprite, cardSprite, BuildHomeScene);
            ProcessScene("Assets/Scenes/2_FireSafetyAR.unity", roundedSprite, cardSprite, BuildARScene);

            Debug.Log("<b>[Suraksha UI Builder] Complete!</b> All scenes rebuilt with fixed responsive layouts and working buttons.");
        }
    }

    static void ProcessScene(string scenePath, Sprite roundedSprite, Sprite cardSprite, System.Action<Canvas, Sprite, Sprite> buildAction)
    {
        if (File.Exists(scenePath))
        {
            Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
            
            Canvas canvas = Object.FindAnyObjectByType<Canvas>();
            if (canvas != null)
            {
                for (int i = canvas.transform.childCount - 1; i >= 0; i--)
                {
                    Object.DestroyImmediate(canvas.transform.GetChild(i).gameObject);
                }
            }
            else
            {
                GameObject canvasObj = new GameObject("Canvas");
                canvas = canvasObj.AddComponent<Canvas>();
                canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                CanvasScaler scaler = canvasObj.AddComponent<CanvasScaler>();
                scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                scaler.referenceResolution = new Vector2(1080, 2400); // Standard portrait
                scaler.matchWidthOrHeight = 0.5f;
                canvasObj.AddComponent<GraphicRaycaster>();
            }

            buildAction(canvas, roundedSprite, cardSprite);
            EditorSceneManager.SaveScene(scene, scenePath);
        }
    }

    // ==========================================
    // 0_LOGIN SCENE
    // ==========================================
    static void BuildLoginScene(Canvas canvas, Sprite pill, Sprite card)
    {
        CreateBackground(canvas.transform, bgDark);

        // Center content using a master vertical layout group
        GameObject layoutGroupObj = new GameObject("LoginLayout");
        layoutGroupObj.transform.SetParent(canvas.transform);
        RectTransform layoutRt = layoutGroupObj.AddComponent<RectTransform>();
        SetAnchor(layoutRt, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero); // Stretch full screen

        VerticalLayoutGroup vl = layoutGroupObj.AddComponent<VerticalLayoutGroup>();
        vl.padding = new RectOffset(100, 100, 200, 200); // Big padding from edges
        vl.spacing = 80;
        vl.childControlHeight = false;
        vl.childControlWidth = true;
        vl.childForceExpandHeight = false;
        vl.childForceExpandWidth = true;
        vl.childAlignment = TextAnchor.UpperCenter;

        // Header
        GameObject logoObj = CreateText(layoutGroupObj.transform, "SURAKSHA-AR", 90, true, textWhite);
        logoObj.GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        logoObj.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 100);
        
        GameObject subLogo = CreateText(layoutGroupObj.transform, "Industrial Safety Training & Certification", 35, false, textGray);
        subLogo.GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        subLogo.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 50);

        // Spacer
        GameObject spacer1 = new GameObject("Spacer"); spacer1.transform.SetParent(layoutGroupObj.transform);
        spacer1.AddComponent<RectTransform>().sizeDelta = new Vector2(0, 150);

        // Login Panel (Card)
        GameObject panelObj = CreatePanel(layoutGroupObj.transform, "LoginPanel", card, panelDark);
        AddOutline(panelObj, outlineColor, 3);
        VerticalLayoutGroup pVl = panelObj.AddComponent<VerticalLayoutGroup>();
        pVl.padding = new RectOffset(60, 60, 80, 80);
        pVl.spacing = 40;
        pVl.childControlHeight = false;
        pVl.childControlWidth = true;

        CreateText(panelObj.transform, "Worker login", 65, true, textWhite).GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        GameObject pSpacer = new GameObject("Spacer"); pSpacer.transform.SetParent(panelObj.transform); pSpacer.AddComponent<RectTransform>().sizeDelta = new Vector2(0, 20);

        CreateText(panelObj.transform, "Worker ID", 40, false, textWhite).GetComponent<Text>().alignment = TextAnchor.MiddleLeft;
        
        // Proper Input Field
        GameObject inputField = CreateInputField(panelObj.transform, "Enter your ID", pill, inputBg, textWhite);
        inputField.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 140);
        AddOutline(inputField, outlineColor, 3);
        
        GameObject pSpacer2 = new GameObject("Spacer"); pSpacer2.transform.SetParent(panelObj.transform); pSpacer2.AddComponent<RectTransform>().sizeDelta = new Vector2(0, 20);

        CreateText(panelObj.transform, "QR scan option for quickly identifying a worker", 35, false, textWhite).GetComponent<Text>().alignment = TextAnchor.MiddleLeft;

        GameObject qrBtn = CreateButton(panelObj.transform, "Scan QR Code", pill, inputBg, textWhite, 45, true);
        qrBtn.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 140);
        AddOutline(qrBtn, outlineColor, 4);

        GameObject pSpacer3 = new GameObject("Spacer"); pSpacer3.transform.SetParent(panelObj.transform); pSpacer3.AddComponent<RectTransform>().sizeDelta = new Vector2(0, 20);

        GameObject continueBtn = CreateButton(panelObj.transform, "CONTINUE", pill, accentOrange, Color.black, 55, true);
        continueBtn.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 150);

        // Link with UIFlowHelper to load Home scene securely
        UIFlowHelper helper = continueBtn.AddComponent<UIFlowHelper>();
        helper.sceneToLoad = "1_Home";

        // LoginManager wire-up (fallback if used)
        var loginManager = Object.FindAnyObjectByType<LoginManager>();
        if (loginManager != null) {
            loginManager.workerIdInput = inputField.GetComponent<InputField>();
        }
    }

    // ==========================================
    // 1_HOME SCENE
    // ==========================================
    static void BuildHomeScene(Canvas canvas, Sprite pill, Sprite card)
    {
        CreateBackground(canvas.transform, bgDark);

        GameObject layoutGroupObj = new GameObject("HomeLayout");
        layoutGroupObj.transform.SetParent(canvas.transform);
        RectTransform layoutRt = layoutGroupObj.AddComponent<RectTransform>();
        SetAnchor(layoutRt, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero); // Stretch full screen

        VerticalLayoutGroup vl = layoutGroupObj.AddComponent<VerticalLayoutGroup>();
        vl.padding = new RectOffset(60, 60, 120, 120); // Margins
        vl.spacing = 60;
        vl.childControlHeight = false;
        vl.childControlWidth = true;
        vl.childForceExpandHeight = false;

        // 1. App Bar
        GameObject title = CreateText(layoutGroupObj.transform, "Safety Training", 65, true, textWhite);
        title.GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        title.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 80);

        GameObject profile = CreateText(layoutGroupObj.transform, "Worker: Rajesh Sharma\nID: WS-100456", 35, false, textGray);
        profile.GetComponent<Text>().alignment = TextAnchor.MiddleLeft;
        profile.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 80);

        GameObject spacer = new GameObject("Spacer"); spacer.transform.SetParent(layoutGroupObj.transform); spacer.AddComponent<RectTransform>().sizeDelta = new Vector2(0, 20);

        // 2. Dashboard
        GameObject dash = CreateText(layoutGroupObj.transform, "Competency Score                   Overall Training Progress", 35, true, textWhite);
        dash.GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        dash.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 50);

        // 3. Horizontal Cards Area
        GameObject cardsArea = new GameObject("CardsArea");
        cardsArea.transform.SetParent(layoutGroupObj.transform);
        cardsArea.AddComponent<RectTransform>().sizeDelta = new Vector2(0, 600); // Fixed height for cards
        HorizontalLayoutGroup hl = cardsArea.AddComponent<HorizontalLayoutGroup>();
        hl.spacing = 40;
        hl.childControlHeight = true;
        hl.childControlWidth = true;
        hl.childForceExpandWidth = true;

        // Card 1
        GameObject card1 = CreatePanel(cardsArea.transform, "FireCard", card, textWhite);
        VerticalLayoutGroup vl1 = card1.AddComponent<VerticalLayoutGroup>();
        vl1.padding = new RectOffset(40, 40, 40, 40); vl1.spacing = 30; vl1.childControlHeight = false; vl1.childControlWidth = true;
        
        CreateText(card1.transform, "Fire & Explosion\nResponse", 45, true, Color.black).GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        CreatePanel(card1.transform, "Prog", pill, accentOrange).GetComponent<RectTransform>().sizeDelta = new Vector2(0, 20);
        GameObject btn1 = CreateButton(card1.transform, "Continue Training", pill, accentOrange, Color.white, 40, true);
        btn1.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 100);

        // Card 2
        GameObject card2 = CreatePanel(cardsArea.transform, "GasCard", card, textWhite);
        VerticalLayoutGroup vl2 = card2.AddComponent<VerticalLayoutGroup>();
        vl2.padding = new RectOffset(40, 40, 40, 40); vl2.spacing = 30; vl2.childControlHeight = false; vl2.childControlWidth = true;
        
        CreateText(card2.transform, "Gas Leak &\nConfined Space", 45, true, Color.black).GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        CreatePanel(card2.transform, "Prog", pill, textGray).GetComponent<RectTransform>().sizeDelta = new Vector2(0, 20);
        GameObject btn2 = CreateButton(card2.transform, "Start Training", pill, outlineColor, Color.white, 40, true);
        btn2.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 100);

        // 4. Menu List
        GameObject listSpacer = new GameObject("Spacer"); listSpacer.transform.SetParent(layoutGroupObj.transform); listSpacer.AddComponent<RectTransform>().sizeDelta = new Vector2(0, 20);
        
        CreateText(layoutGroupObj.transform, "  My Assessments", 45, true, textWhite).GetComponent<RectTransform>().sizeDelta = new Vector2(0, 80);
        CreateText(layoutGroupObj.transform, "  Certificates", 45, true, textWhite).GetComponent<RectTransform>().sizeDelta = new Vector2(0, 80);
        CreateText(layoutGroupObj.transform, "  Training History", 45, true, textWhite).GetComponent<RectTransform>().sizeDelta = new Vector2(0, 80);
        CreateText(layoutGroupObj.transform, "  Recommended Training", 45, true, textWhite).GetComponent<RectTransform>().sizeDelta = new Vector2(0, 80);

        // 5. Briefing Popup
        GameObject briefPanel = CreatePanel(canvas.transform, "BriefingPopup", card, bgDark);
        SetAnchor(briefPanel.GetComponent<RectTransform>(), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero); // Full screen
        briefPanel.SetActive(false); // Hidden by default

        VerticalLayoutGroup vlBrief = briefPanel.AddComponent<VerticalLayoutGroup>();
        vlBrief.padding = new RectOffset(80, 80, 200, 100);
        vlBrief.spacing = 60;
        vlBrief.childControlHeight = false;
        vlBrief.childControlWidth = true;

        CreateText(briefPanel.transform, "FIRE & EXPLOSION\nRESPONSE", 80, true, textWhite).GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        
        GameObject bCard = CreatePanel(briefPanel.transform, "ObjCard", card, panelDark);
        bCard.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 900);
        VerticalLayoutGroup vlObj = bCard.AddComponent<VerticalLayoutGroup>();
        vlObj.padding = new RectOffset(60, 60, 60, 60); vlObj.spacing = 40; vlObj.childControlHeight = false; vlObj.childControlWidth = true;

        CreateText(bCard.transform, "TRAINING OBJECTIVE", 45, true, textWhite).GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        CreateText(bCard.transform, "- Identify hazards\n- Select correct PPE\n- Choose appropriate extinguisher\n- Control the fire", 45, false, textWhite).GetComponent<RectTransform>().sizeDelta = new Vector2(0, 300);
        CreateText(bCard.transform, "You will enter a simulated industrial emergency.", 35, false, textGray).GetComponent<Text>().alignment = TextAnchor.MiddleCenter;

        GameObject startSimBtn = CreateButton(briefPanel.transform, "START SIMULATION", pill, accentOrange, Color.black, 55, true);
        startSimBtn.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 160);

        // Wire events using UIFlowHelper
        UIFlowHelper briefHelper = btn1.AddComponent<UIFlowHelper>();
        briefHelper.panelToToggle = briefPanel;

        UIFlowHelper simHelper = startSimBtn.AddComponent<UIFlowHelper>();
        simHelper.sceneToLoad = "2_FireSafetyAR";
    }

    // ==========================================
    // 2_FIRESAFETYAR SCENE
    // ==========================================
    static void BuildARScene(Canvas canvas, Sprite pill, Sprite card)
    {
        // Glass Panel at the top
        GameObject glassPanel = CreatePanel(canvas.transform, "InstructionGlassPanel", pill, new Color(0.1f, 0.15f, 0.2f, 0.85f));
        RectTransform glassRt = glassPanel.GetComponent<RectTransform>();
        SetAnchor(glassRt, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -100), new Vector2(1000, 250));
        AddOutline(glassPanel, outlineColor, 4);

        GameObject instText = CreateText(glassPanel.transform, "Tap the floor to spawn fire", 50, true, textWhite);
        instText.name = "InstructionText"; // Important for ARFireManager
        instText.GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        SetAnchor(instText.GetComponent<RectTransform>(), Vector2.zero, Vector2.one, Vector2.zero, new Vector2(-40, -40));

        // Back Home Button (Hidden by default)
        GameObject backBtn = CreateButton(canvas.transform, "Back Home", pill, panelDark, textWhite, 55, true);
        backBtn.name = "BackHomeButton"; // Important for ARFireManager
        RectTransform backRt = backBtn.GetComponent<RectTransform>();
        SetAnchor(backRt, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0, 150), new Vector2(600, 150));
        AddOutline(backBtn, outlineColor, 4);
        
        // CRITICAL: Ensure UIFlowHelper is attached so ARFireManager can find it, OR let ARFireManager assign it.
        // ARFireManager hooks into this dynamically, but let's ensure it has a target graphic.
        backBtn.SetActive(false);
    }

    // ==========================================
    // UTILS
    // ==========================================
    static void CreateBackground(Transform parent, Color color)
    {
        GameObject bgObj = new GameObject("Background");
        bgObj.transform.SetParent(parent);
        bgObj.transform.SetSiblingIndex(0);
        RectTransform rt = bgObj.AddComponent<RectTransform>();
        SetAnchor(rt, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        bgObj.AddComponent<Image>().color = color;
    }

    static GameObject CreatePanel(Transform parent, string name, Sprite sprite, Color color)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent);
        RectTransform rt = obj.AddComponent<RectTransform>();
        Image img = obj.AddComponent<Image>();
        img.sprite = sprite;
        img.type = Image.Type.Sliced;
        img.color = color;
        return obj;
    }

    static GameObject CreateText(Transform parent, string content, int size, bool bold, Color color)
    {
        GameObject obj = new GameObject("Text");
        obj.transform.SetParent(parent);
        RectTransform rt = obj.AddComponent<RectTransform>();
        Text txt = obj.AddComponent<Text>();
        txt.text = content;
        txt.fontSize = size;
        txt.fontStyle = bold ? FontStyle.Bold : FontStyle.Normal;
        txt.color = color;
        
        Font customFont = AssetDatabase.LoadAssetAtPath<Font>("Assets/UI/Kenney/Font/Kenney Future.ttf");
        if (customFont != null) {
            txt.font = customFont;
        } else {
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        }
        
        return obj;
    }

    static GameObject CreateButton(Transform parent, string label, Sprite sprite, Color bgColor, Color textColor, int fontSize, bool bold)
    {
        GameObject obj = CreatePanel(parent, "Button", sprite, bgColor);
        Button btn = obj.AddComponent<Button>();
        btn.targetGraphic = obj.GetComponent<Image>(); // THIS IS CRITICAL FOR CLICKS
        
        GameObject txtObj = CreateText(obj.transform, label, fontSize, bold, textColor);
        txtObj.GetComponent<Text>().alignment = TextAnchor.MiddleCenter;
        SetAnchor(txtObj.GetComponent<RectTransform>(), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        
        return obj;
    }

    static GameObject CreateInputField(Transform parent, string placeholderText, Sprite sprite, Color bgColor, Color textColor)
    {
        GameObject obj = CreatePanel(parent, "InputField", sprite, bgColor);
        InputField input = obj.AddComponent<InputField>();
        input.targetGraphic = obj.GetComponent<Image>(); // CRITICAL FOR CLICKS
        
        GameObject textObj = CreateText(obj.transform, "", 45, false, textColor);
        textObj.name = "Text";
        SetAnchor(textObj.GetComponent<RectTransform>(), Vector2.zero, Vector2.one, Vector2.zero, new Vector2(-60, 0));
        input.textComponent = textObj.GetComponent<Text>();
        input.textComponent.alignment = TextAnchor.MiddleLeft;

        GameObject placeholderObj = CreateText(obj.transform, placeholderText, 45, false, new Color(textColor.r, textColor.g, textColor.b, 0.5f));
        placeholderObj.name = "Placeholder";
        SetAnchor(placeholderObj.GetComponent<RectTransform>(), Vector2.zero, Vector2.one, Vector2.zero, new Vector2(-60, 0));
        placeholderObj.GetComponent<Text>().alignment = TextAnchor.MiddleLeft;
        input.placeholder = placeholderObj.GetComponent<Text>();

        return obj;
    }

    static void AddOutline(GameObject obj, Color color, float width)
    {
        Outline outline = obj.AddComponent<Outline>();
        outline.effectColor = color;
        outline.effectDistance = new Vector2(width, -width);
    }

    static void SetAnchor(RectTransform rt, Vector2 anchorMin, Vector2 anchorMax, Vector2 anchoredPos, Vector2 sizeDelta)
    {
        rt.anchorMin = anchorMin;
        rt.anchorMax = anchorMax;
        rt.anchoredPosition = anchoredPos;
        rt.sizeDelta = sizeDelta;
        rt.localScale = Vector3.one;
    }

    static Sprite CreateRoundedSprite(int r, string name)
    {
        string path = "Assets/Sprites";
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);

        string texPath = path + "/" + name + ".png";
        int size = r * 2;
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
            importer.spriteBorder = new Vector4(r, r, r, r);
            importer.mipmapEnabled = false;
            importer.SaveAndReimport();
        }

        return AssetDatabase.LoadAssetAtPath<Sprite>(texPath);
    }
}
