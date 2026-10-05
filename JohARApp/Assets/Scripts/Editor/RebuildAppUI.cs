using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.IO;

public class RebuildAppUI
{
    // Color Palette
    static Color bgDark = new Color(0.06f, 0.09f, 0.16f, 1f);       // #0F172A (Deep Slate)
    static Color panelDark = new Color(0.12f, 0.16f, 0.24f, 0.95f);  // #1E293B (Industrial Slate)
    static Color cardBorder = new Color(0.20f, 0.28f, 0.40f, 1f);   // #334155
    static Color textWhite = new Color(0.96f, 0.98f, 1f, 1f);
    static Color textGold = new Color(1f, 0.82f, 0.15f, 1f);
    static Color textMuted = new Color(0.65f, 0.72f, 0.82f, 1f);

    [MenuItem("JohAR/Rebuild Complete Kenney UI")]
    public static void RebuildAll()
    {
        if (EditorApplication.isPlaying)
        {
            Debug.LogError("Cannot build UI in Play Mode.");
            return;
        }

        // 1. Ensure Sprite Importer has configured all 9-slice textures
        SetupKenneySprites.ConfigureSprites();

        // 2. Load Minimal, Modern Inter Font for the whole app
        Font interFont = AssetDatabase.LoadAssetAtPath<Font>("Assets/MobileARTemplateAssets/UI/Fonts/Inter-Regular.ttf");
        if (interFont == null) interFont = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        
        Font titleFont = interFont;
        Font regularFont = interFont;

        // 3. Load Key Sprites
        Sprite btnYellow = LoadSprite("Assets/UI/Kenney/PNG/Yellow/Double/button_rectangle_depth_gradient.png");
        Sprite btnGreen = LoadSprite("Assets/UI/Kenney/PNG/Green/Double/button_rectangle_depth_flat.png");
        Sprite btnBlue = LoadSprite("Assets/UI/Kenney/PNG/Blue/Double/button_rectangle_depth_flat.png");
        Sprite btnRed = LoadSprite("Assets/UI/Kenney/PNG/Red/Double/button_rectangle_depth_flat.png");
        Sprite btnGrey = LoadSprite("Assets/UI/Kenney/PNG/Grey/Double/button_rectangle_depth_flat.png");
        Sprite panelBorder = LoadSprite("Assets/UI/Kenney/PNG/Grey/Double/button_rectangle_depth_border.png");
        Sprite panelGlass = LoadSprite("Assets/UI/Kenney/PNG/Blue/Double/button_rectangle_border.png");
        Sprite inputBg = LoadSprite("Assets/UI/Kenney/PNG/Extra/Double/input_rectangle.png");
        Sprite starSprite = LoadSprite("Assets/UI/Kenney/PNG/Yellow/Double/star.png");

        if (EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
        {
            // Build Scene 0: Login
            BuildLogin(titleFont, regularFont, btnYellow, btnGreen, btnGrey, panelBorder, inputBg);
            
            // Build Scene 1: Home
            BuildHome(titleFont, regularFont, btnYellow, btnBlue, btnRed, btnGreen, btnGrey, panelBorder, starSprite);

            // Build Scene 2: Fire Safety AR
            BuildARScene(titleFont, regularFont, btnGreen, btnYellow, btnRed, panelGlass, panelBorder, starSprite);

            Debug.Log("<b>[RebuildAppUI] SUCCESS! All 3 scenes rebuilt with modern Inter font and perfected Kenney UI!</b>");
        }
    }

    static Sprite LoadSprite(string path)
    {
        Sprite s = AssetDatabase.LoadAssetAtPath<Sprite>(path);
        if (s == null)
        {
            Texture2D tex = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
            if (tex != null)
            {
                s = Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), new Vector2(0.5f, 0.5f), 100, 0, SpriteMeshType.FullRect, new Vector4(16, 16, 16, 16));
            }
        }
        return s;
    }

    static Canvas PrepareSceneCanvas(string scenePath, Vector2 refResolution, float match)
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
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        if (canvas.GetComponent<GraphicRaycaster>() == null)
        {
            canvas.gameObject.AddComponent<GraphicRaycaster>();
        }

        CanvasScaler scaler = canvas.GetComponent<CanvasScaler>();
        if (scaler == null) scaler = canvas.gameObject.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = refResolution;
        scaler.matchWidthOrHeight = match;

        // Ensure EventSystem exists and is configured for New Input System
        var es = Object.FindAnyObjectByType<UnityEngine.EventSystems.EventSystem>();
        if (es == null)
        {
            GameObject esObj = new GameObject("EventSystem");
            es = esObj.AddComponent<UnityEngine.EventSystems.EventSystem>();
        }

#if ENABLE_INPUT_SYSTEM
        var legacyModule = es.GetComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        if (legacyModule != null)
        {
            Object.DestroyImmediate(legacyModule);
        }
        if (es.GetComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>() == null)
        {
            es.gameObject.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
        }
#else
        if (es.GetComponent<UnityEngine.EventSystems.StandaloneInputModule>() == null)
        {
            es.gameObject.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        }
#endif

        return canvas;
    }

    // =========================================================================
    // 0_LOGIN SCENE
    // =========================================================================
    static void BuildLogin(Font titleFont, Font regularFont, Sprite btnYellow, Sprite btnGreen, Sprite btnGrey, Sprite panelSprite, Sprite inputSprite)
    {
        string path = "Assets/Scenes/0_Login.unity";
        Canvas canvas = PrepareSceneCanvas(path, new Vector2(1080, 1920), 0.5f);

        // Background
        CreateImage(canvas.transform, "Background", null, bgDark, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);

        // 1. Header Panel (Top)
        GameObject headerObj = CreatePanel(canvas.transform, "HeaderPanel", panelSprite, new Color(0.1f, 0.14f, 0.22f, 0.9f),
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -160), new Vector2(960, 200));

        Text titleText = CreateText(headerObj.transform, "TitleText", "SURAKSHA-AR", 48, FontStyle.Bold, textGold, titleFont);
        SetRect(titleText.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0, 30), new Vector2(900, 55));
        titleText.alignment = TextAnchor.MiddleCenter;

        Text subTitleText = CreateText(headerObj.transform, "SubTitleText", "Industrial Safety & Mining Protocol", 24, FontStyle.Normal, textMuted, regularFont);
        SetRect(subTitleText.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0, -35), new Vector2(900, 40));
        subTitleText.alignment = TextAnchor.MiddleCenter;

        // 2. Language Section Card (Upper-Middle)
        GameObject langCard = CreatePanel(canvas.transform, "LanguageCard", panelSprite, panelDark,
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -480), new Vector2(960, 340));

        Text langSectionTitle = CreateText(langCard.transform, "LangSectionTitle", "SELECT LANGUAGE / भाषा", 26, FontStyle.Bold, textWhite, regularFont);
        SetRect(langSectionTitle.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0, 95), new Vector2(900, 45));
        langSectionTitle.alignment = TextAnchor.MiddleCenter;

        // 3 Language Buttons (Properly nested inside LanguageCard with no overflow)
        float btnW = 270;
        float btnH = 110;
        Button btnHindi = CreateButton(langCard.transform, "HindiButton", "हिन्दी\nHindi", 24, regularFont, btnGreen, new Vector2(-290, -40), new Vector2(btnW, btnH));
        Button btnSantali = CreateButton(langCard.transform, "SantaliButton", "ᱥᱟᱱᱛᱟᱲᱤ\nSantali", 24, regularFont, btnGrey, new Vector2(0, -40), new Vector2(btnW, btnH));
        Button btnEnglish = CreateButton(langCard.transform, "EnglishButton", "English\nENG", 24, regularFont, btnGrey, new Vector2(290, -40), new Vector2(btnW, btnH));

        // 3. Worker ID Section Card (Middle)
        GameObject idCard = CreatePanel(canvas.transform, "WorkerIdCard", panelSprite, panelDark,
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -940), new Vector2(960, 480));

        Text idSectionTitle = CreateText(idCard.transform, "IdSectionTitle", "WORKER CREDENTIALS", 26, FontStyle.Bold, textWhite, regularFont);
        SetRect(idSectionTitle.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0, 160), new Vector2(900, 45));
        idSectionTitle.alignment = TextAnchor.MiddleCenter;

        // Input Field inside ID Card
        GameObject inputObj = CreatePanel(idCard.transform, "WorkerInputField", inputSprite, new Color(0.08f, 0.11f, 0.17f, 1f),
            new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0, 30), new Vector2(840, 110));

        InputField inputField = inputObj.AddComponent<InputField>();
        
        Text placeholder = CreateText(inputObj.transform, "Placeholder", "ENTER WORKER ID (e.g. W-7042)", 24, FontStyle.Italic, new Color(0.5f, 0.55f, 0.65f, 0.8f), regularFont);
        SetRect(placeholder.rectTransform, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        placeholder.alignment = TextAnchor.MiddleCenter;
        inputField.placeholder = placeholder;

        Text inputText = CreateText(inputObj.transform, "Text", "", 28, FontStyle.Bold, textGold, regularFont);
        SetRect(inputText.rectTransform, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        inputText.alignment = TextAnchor.MiddleCenter;
        inputField.textComponent = inputText;

        // Quick ID pill button inside ID Card
        Button btnQuickId = CreateButton(idCard.transform, "QuickIdButton", "GENERATE GUEST ID", 22, regularFont, btnGrey, new Vector2(0, -125), new Vector2(440, 75));

        // 4. Continue Action Button (Pinned Cleanly at the Bottom of the Screen)
        Button btnContinue = CreateButton(canvas.transform, "ContinueButton", "CONTINUE TO TRAINING", 30, titleFont != null ? titleFont : regularFont, btnYellow, Vector2.zero, new Vector2(960, 135));
        SetRect(btnContinue.GetComponent<RectTransform>(), new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0, 180), new Vector2(960, 135));
        var contText = btnContinue.GetComponentInChildren<Text>();
        if (contText != null) contText.color = new Color(0.12f, 0.08f, 0.02f, 1f); // High contrast dark text on yellow

        // 5. Footer Safety Compliance Note (Bottom Most)
        Text footerText = CreateText(canvas.transform, "FooterText", "DGMS Compliant Safety System • Version 2.4", 20, FontStyle.Normal, new Color(0.45f, 0.5f, 0.6f, 1f), regularFont);
        SetRect(footerText.rectTransform, new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0, 60), new Vector2(960, 45));
        footerText.alignment = TextAnchor.MiddleCenter;

        // Hook up LoginManager
        var lm = Object.FindAnyObjectByType<LoginManager>();
        if (lm == null)
        {
            GameObject logicObj = new GameObject("LoginManager");
            lm = logicObj.AddComponent<LoginManager>();
        }

        lm.workerIdInput = inputField;
        lm.hindiButton = btnHindi;
        lm.santaliButton = btnSantali;
        lm.englishButton = btnEnglish;
        lm.continueButton = btnContinue;
        lm.quickIdButton = btnQuickId;
        lm.headerSubtitleText = subTitleText;
        lm.languageSectionTitle = langSectionTitle;
        lm.workerIdSectionTitle = idSectionTitle;
        lm.continueButtonText = contText;
        lm.activeLangSprite = btnGreen;
        lm.inactiveLangSprite = btnGrey;

        EditorUtility.SetDirty(lm);
        EditorSceneManager.SaveScene(canvas.gameObject.scene, path);
    }

    [MenuItem("JohAR/Rebuild Home Page UI")]
    public static void RebuildHomeOnly()
    {
        SetupKenneySprites.ConfigureSprites();
        Font interFont = AssetDatabase.LoadAssetAtPath<Font>("Assets/MobileARTemplateAssets/UI/Fonts/Inter-Regular.ttf");
        if (interFont == null) interFont = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");

        Sprite btnYellow = LoadSprite("Assets/UI/Kenney/PNG/Yellow/Double/button_rectangle_depth_gradient.png");
        Sprite btnGreen = LoadSprite("Assets/UI/Kenney/PNG/Green/Double/button_rectangle_depth_flat.png");
        Sprite btnBlue = LoadSprite("Assets/UI/Kenney/PNG/Blue/Double/button_rectangle_depth_flat.png");
        Sprite btnRed = LoadSprite("Assets/UI/Kenney/PNG/Red/Double/button_rectangle_depth_flat.png");
        Sprite btnGrey = LoadSprite("Assets/UI/Kenney/PNG/Grey/Double/button_rectangle_depth_flat.png");
        Sprite panelBorder = LoadSprite("Assets/UI/Kenney/PNG/Grey/Double/button_rectangle_depth_border.png");
        Sprite starSprite = LoadSprite("Assets/UI/Kenney/PNG/Yellow/Double/star.png");

        BuildHome(interFont, interFont, btnYellow, btnBlue, btnRed, btnGreen, btnGrey, panelBorder, starSprite);
        Debug.Log("<b>[RebuildAppUI] Home Page UI successfully perfected and saved!</b>");
    }

    // =========================================================================
    // 1_HOME SCENE (Perfected Proportions & Fittings)
    // =========================================================================
    static void BuildHome(Font titleFont, Font regularFont, Sprite btnYellow, Sprite btnBlue, Sprite btnRed, Sprite btnGreen, Sprite btnGrey, Sprite panelSprite, Sprite starSprite)
    {
        string path = "Assets/Scenes/1_Home.unity";
        Canvas canvas = PrepareSceneCanvas(path, new Vector2(1080, 1920), 0f);

        // 1. Deep Slate Background
        CreateImage(canvas.transform, "Background", null, bgDark, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);

        // Ambient glows
        GameObject topGlow = CreateImage(canvas.transform, "TopAmbientGlow", null, new Color(0.12f, 0.20f, 0.35f, 0.45f),
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -100), new Vector2(1080, 300));
        topGlow.transform.SetSiblingIndex(1);

        GameObject bottomGlow = CreateImage(canvas.transform, "BottomAmbientGlow", null, new Color(0.25f, 0.18f, 0.05f, 0.25f),
            new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0, 100), new Vector2(1080, 300));
        bottomGlow.transform.SetSiblingIndex(2);

        // 2. Top System HUD Bar (Brand & Live Status)
        GameObject hudBar = new GameObject("TopHUDBar");
        hudBar.transform.SetParent(canvas.transform, false);
        RectTransform hudRt = hudBar.AddComponent<RectTransform>();
        SetRect(hudRt, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -42), new Vector2(1000, 36));

        Text brandText = CreateText(hudBar.transform, "BrandText", "● SURAKSHA-AR • MINING SAFETY SYSTEM", 19, FontStyle.Bold, textGold, regularFont);
        SetRect(brandText.rectTransform, new Vector2(0, 0), new Vector2(0.6f, 1), Vector2.zero, Vector2.zero);
        brandText.alignment = TextAnchor.MiddleLeft;

        Text netStatus = CreateText(hudBar.transform, "NetStatus", "ONLINE • SECTOR 4 MINE", 18, FontStyle.Bold, new Color(0.2f, 0.85f, 0.5f, 1f), regularFont);
        SetRect(netStatus.rectTransform, new Vector2(0.6f, 0), new Vector2(1f, 1), Vector2.zero, Vector2.zero);
        netStatus.alignment = TextAnchor.MiddleRight;

        // 3. Worker Profile Header Card (Clean Industrial Badge - Height 195)
        GameObject profCard = CreatePanel(canvas.transform, "ProfileCard", panelSprite, panelDark,
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -165), new Vector2(1000, 195));

        // Worker Avatar Badge Box on Left
        GameObject avatarBox = CreatePanel(profCard.transform, "AvatarBadge", panelSprite, new Color(0.18f, 0.24f, 0.35f, 1f),
            new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-430, 0), new Vector2(90, 90));
        Text avatarInitial = CreateText(avatarBox.transform, "Initials", "JH", 34, FontStyle.Bold, textGold, titleFont);
        SetRect(avatarInitial.rectTransform, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        avatarInitial.alignment = TextAnchor.MiddleCenter;

        // Welcome & Role Details (Generous horizontal area from -365 to +275)
        Text welcomeText = CreateText(profCard.transform, "WelcomeText", "Welcome, Worker_7042!", 33, FontStyle.Bold, textGold, titleFont != null ? titleFont : regularFont);
        SetRect(welcomeText.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-50, 36), new Vector2(630, 40));
        welcomeText.alignment = TextAnchor.MiddleLeft;

        Text roleBadge = CreateText(profCard.transform, "RoleBadge", "Level 1 Safety Trainee • Sector 4 Mine", 20, FontStyle.Normal, textMuted, regularFont);
        SetRect(roleBadge.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-50, -2), new Vector2(630, 30));
        roleBadge.alignment = TextAnchor.MiddleLeft;

        Text verifiedText = CreateText(profCard.transform, "VerifiedBadge", "● VERIFIED WORKER • SHIFT ACTIVE", 16, FontStyle.Bold, new Color(0.2f, 0.85f, 0.45f, 1f), regularFont);
        SetRect(verifiedText.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-50, -38), new Vector2(630, 26));
        verifiedText.alignment = TextAnchor.MiddleLeft;

        // Dedicated Action Toolbar on Right
        Button langToggleBtn = CreateButton(profCard.transform, "LangToggleBtn", "🌐 English", 21, regularFont, btnGrey, new Vector2(380, 26), new Vector2(185, 62), new Color(0.12f, 0.16f, 0.24f, 1f));
        Button logoutBtn = CreateButton(profCard.transform, "LogoutBtn", "LOGOUT", 20, regularFont, btnRed, new Vector2(380, -42), new Vector2(185, 58), textWhite);

        // 4. Section Divider Title
        GameObject sectionHeader = new GameObject("SectionHeader");
        sectionHeader.transform.SetParent(canvas.transform, false);
        RectTransform secRt = sectionHeader.AddComponent<RectTransform>();
        SetRect(secRt, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -282), new Vector2(1000, 32));

        Text secTitle = CreateText(sectionHeader.transform, "SecTitle", "TRAINING & EMERGENCY MODULES", 19, FontStyle.Bold, textMuted, regularFont);
        SetRect(secTitle.rectTransform, new Vector2(0, 0), new Vector2(0.7f, 1), Vector2.zero, Vector2.zero);
        secTitle.alignment = TextAnchor.MiddleLeft;

        Text secCount = CreateText(sectionHeader.transform, "SecCount", "3 MODULES ACTIVE", 17, FontStyle.Bold, textGold, regularFont);
        SetRect(secCount.rectTransform, new Vector2(0.7f, 0), new Vector2(1f, 1), Vector2.zero, Vector2.zero);
        secCount.alignment = TextAnchor.MiddleRight;

        // 5. Scrollable Module Viewport Container
        GameObject scrollObj = new GameObject("ScrollContainer");
        scrollObj.transform.SetParent(canvas.transform, false);
        RectTransform scrollRt = scrollObj.AddComponent<RectTransform>();
        scrollRt.anchorMin = new Vector2(0f, 0f);
        scrollRt.anchorMax = new Vector2(1f, 1f);
        scrollRt.offsetMin = new Vector2(20, 15);
        scrollRt.offsetMax = new Vector2(-20, -305);

        ScrollRect scrollRect = scrollObj.AddComponent<ScrollRect>();
        scrollRect.horizontal = false;
        scrollRect.vertical = true;
        scrollRect.movementType = ScrollRect.MovementType.Elastic;
        scrollRect.elasticity = 0.1f;
        scrollRect.inertia = true;
        scrollRect.decelerationRate = 0.135f;
        scrollRect.scrollSensitivity = 25f;

        GameObject contentObj = new GameObject("Content");
        contentObj.transform.SetParent(scrollObj.transform, false);
        RectTransform contentRt = contentObj.AddComponent<RectTransform>();
        contentRt.anchorMin = new Vector2(0.5f, 1f);
        contentRt.anchorMax = new Vector2(0.5f, 1f);
        contentRt.pivot = new Vector2(0.5f, 1f);
        contentRt.anchoredPosition = Vector2.zero;
        contentRt.sizeDelta = new Vector2(1000, 1420);
        scrollRect.content = contentRt;

        // -------------------------------------------------------------
        // MODULE 1: FIRE SAFETY & AR EXTINGUISHER (Hero Card - Height: 350)
        // -------------------------------------------------------------
        GameObject mod1 = CreatePanel(contentRt, "Module1_FireSafety", panelSprite, new Color(0.12f, 0.17f, 0.27f, 0.98f),
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -15), new Vector2(1000, 350));
        RectTransform mod1Rt = mod1.GetComponent<RectTransform>();
        mod1Rt.pivot = new Vector2(0.5f, 1f);

        // Tag row (top: 24, height: 28)
        GameObject mod1TagRow = new GameObject("TagRow");
        mod1TagRow.transform.SetParent(mod1.transform, false);
        RectTransform m1TagRt = mod1TagRow.AddComponent<RectTransform>();
        m1TagRt.anchorMin = new Vector2(0.5f, 1f);
        m1TagRt.anchorMax = new Vector2(0.5f, 1f);
        m1TagRt.pivot = new Vector2(0.5f, 1f);
        m1TagRt.anchoredPosition = new Vector2(0, -24);
        m1TagRt.sizeDelta = new Vector2(930, 28);

        Text mod1Tag = CreateText(mod1TagRow.transform, "Mod1Tag", "MODULE 01 • PRIMARY AR SIMULATION", 19, FontStyle.Bold, textGold, regularFont);
        SetRect(mod1Tag.rectTransform, new Vector2(0, 0), new Vector2(0.7f, 1), Vector2.zero, Vector2.zero);
        mod1Tag.alignment = TextAnchor.MiddleLeft;

        Text mod1Chip = CreateText(mod1TagRow.transform, "Mod1Chip", "● READY TO DRILL", 17, FontStyle.Bold, new Color(0.2f, 0.85f, 0.4f, 1f), regularFont);
        SetRect(mod1Chip.rectTransform, new Vector2(0.65f, 0), new Vector2(1f, 1), Vector2.zero, Vector2.zero);
        mod1Chip.alignment = TextAnchor.MiddleRight;

        // Title (top: 64, height: 42)
        Text mod1Title = CreateText(mod1.transform, "Mod1Title", "Fire Safety & Extinguisher (AR)", 34, FontStyle.Bold, textWhite, regularFont);
        RectTransform m1TitleRt = mod1Title.rectTransform;
        m1TitleRt.anchorMin = new Vector2(0.5f, 1f);
        m1TitleRt.anchorMax = new Vector2(0.5f, 1f);
        m1TitleRt.pivot = new Vector2(0.5f, 1f);
        m1TitleRt.anchoredPosition = new Vector2(0, -64);
        m1TitleRt.sizeDelta = new Vector2(930, 42);
        mod1Title.alignment = TextAnchor.MiddleLeft;

        // Description (top: 118, height: 68)
        Text mod1Desc = CreateText(mod1.transform, "Mod1Desc", "Interactive 3D AR drill using the P.A.S.S. protocol (Pull, Aim, Squeeze, Sweep). Practice extinguishing simulated mine fires in real-time.", 20, FontStyle.Normal, textMuted, regularFont);
        RectTransform m1DescRt = mod1Desc.rectTransform;
        m1DescRt.anchorMin = new Vector2(0.5f, 1f);
        m1DescRt.anchorMax = new Vector2(0.5f, 1f);
        m1DescRt.pivot = new Vector2(0.5f, 1f);
        m1DescRt.anchoredPosition = new Vector2(0, -118);
        m1DescRt.sizeDelta = new Vector2(930, 68);
        mod1Desc.alignment = TextAnchor.UpperLeft;
        mod1Desc.lineSpacing = 1.2f;

        // Action CTA Button (bottom pinned: pos (0, 24), height 96, width 930)
        Button btnStartFire = CreateButton(mod1.transform, "StartFireSafetyButton", "START AR SIMULATION ▶", 30, regularFont, btnYellow, Vector2.zero, new Vector2(930, 96), new Color(0.12f, 0.08f, 0.02f, 1f));
        RectTransform fireBtnRt = btnStartFire.GetComponent<RectTransform>();
        fireBtnRt.anchorMin = new Vector2(0.5f, 0f);
        fireBtnRt.anchorMax = new Vector2(0.5f, 0f);
        fireBtnRt.pivot = new Vector2(0.5f, 0f);
        fireBtnRt.anchoredPosition = new Vector2(0, 24);
        var fireBtnText = btnStartFire.GetComponentInChildren<Text>();

        // -------------------------------------------------------------
        // MODULE 2: HAZARD & GAS REPORTING (Height: 350)
        // -------------------------------------------------------------
        GameObject mod2 = CreatePanel(contentRt, "Module2_Hazard", panelSprite, panelDark,
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -390), new Vector2(1000, 350));
        RectTransform mod2Rt = mod2.GetComponent<RectTransform>();
        mod2Rt.pivot = new Vector2(0.5f, 1f);

        // Tag row (top: 24, height: 28)
        GameObject mod2TagRow = new GameObject("TagRow");
        mod2TagRow.transform.SetParent(mod2.transform, false);
        RectTransform m2TagRt = mod2TagRow.AddComponent<RectTransform>();
        m2TagRt.anchorMin = new Vector2(0.5f, 1f);
        m2TagRt.anchorMax = new Vector2(0.5f, 1f);
        m2TagRt.pivot = new Vector2(0.5f, 1f);
        m2TagRt.anchoredPosition = new Vector2(0, -24);
        m2TagRt.sizeDelta = new Vector2(930, 28);

        Text mod2Tag = CreateText(mod2TagRow.transform, "Mod2Tag", "MODULE 02 • SAFETY INSPECTION", 19, FontStyle.Bold, new Color(0.38f, 0.72f, 1f, 1f), regularFont);
        SetRect(mod2Tag.rectTransform, new Vector2(0, 0), new Vector2(0.7f, 1), Vector2.zero, Vector2.zero);
        mod2Tag.alignment = TextAnchor.MiddleLeft;

        Text mod2Chip = CreateText(mod2TagRow.transform, "Mod2Chip", "● LOG SYSTEM", 17, FontStyle.Bold, new Color(0.38f, 0.72f, 1f, 1f), regularFont);
        SetRect(mod2Chip.rectTransform, new Vector2(0.65f, 0), new Vector2(1f, 1), Vector2.zero, Vector2.zero);
        mod2Chip.alignment = TextAnchor.MiddleRight;

        // Title (top: 64, height: 42)
        Text mod2Title = CreateText(mod2.transform, "Mod2Title", "Hazard & Gas Leak Reporting", 34, FontStyle.Bold, textWhite, regularFont);
        RectTransform m2TitleRt = mod2Title.rectTransform;
        m2TitleRt.anchorMin = new Vector2(0.5f, 1f);
        m2TitleRt.anchorMax = new Vector2(0.5f, 1f);
        m2TitleRt.pivot = new Vector2(0.5f, 1f);
        m2TitleRt.anchoredPosition = new Vector2(0, -64);
        m2TitleRt.sizeDelta = new Vector2(930, 42);
        mod2Title.alignment = TextAnchor.MiddleLeft;

        // Description (top: 118, height: 68)
        Text mod2Desc = CreateText(mod2.transform, "Mod2Desc", "Log toxic gas anomalies (CO/CH4), structural fractures, rockfall risks, or faulty ventilation shafts directly to mine safety controllers.", 20, FontStyle.Normal, textMuted, regularFont);
        RectTransform m2DescRt = mod2Desc.rectTransform;
        m2DescRt.anchorMin = new Vector2(0.5f, 1f);
        m2DescRt.anchorMax = new Vector2(0.5f, 1f);
        m2DescRt.pivot = new Vector2(0.5f, 1f);
        m2DescRt.anchoredPosition = new Vector2(0, -118);
        m2DescRt.sizeDelta = new Vector2(930, 68);
        mod2Desc.alignment = TextAnchor.UpperLeft;
        mod2Desc.lineSpacing = 1.2f;

        // Action CTA Button
        Button btnReportHazard = CreateButton(mod2.transform, "ReportHazardButton", "REPORT MINE HAZARD ⚠", 28, regularFont, btnBlue, Vector2.zero, new Vector2(930, 92), textWhite);
        RectTransform rptBtnRt = btnReportHazard.GetComponent<RectTransform>();
        rptBtnRt.anchorMin = new Vector2(0.5f, 0f);
        rptBtnRt.anchorMax = new Vector2(0.5f, 0f);
        rptBtnRt.pivot = new Vector2(0.5f, 0f);
        rptBtnRt.anchoredPosition = new Vector2(0, 24);

        // -------------------------------------------------------------
        // MODULE 3: EMERGENCY SOS (Height: 350)
        // -------------------------------------------------------------
        GameObject mod3 = CreatePanel(contentRt, "Module3_SOS", panelSprite, panelDark,
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -765), new Vector2(1000, 350));
        RectTransform mod3Rt = mod3.GetComponent<RectTransform>();
        mod3Rt.pivot = new Vector2(0.5f, 1f);

        // Tag row (top: 24, height: 28)
        GameObject mod3TagRow = new GameObject("TagRow");
        mod3TagRow.transform.SetParent(mod3.transform, false);
        RectTransform m3TagRt = mod3TagRow.AddComponent<RectTransform>();
        m3TagRt.anchorMin = new Vector2(0.5f, 1f);
        m3TagRt.anchorMax = new Vector2(0.5f, 1f);
        m3TagRt.pivot = new Vector2(0.5f, 1f);
        m3TagRt.anchoredPosition = new Vector2(0, -24);
        m3TagRt.sizeDelta = new Vector2(930, 28);

        Text mod3Tag = CreateText(mod3TagRow.transform, "Mod3Tag", "MODULE 03 • EMERGENCY RESPONSE", 19, FontStyle.Bold, new Color(1f, 0.45f, 0.45f, 1f), regularFont);
        SetRect(mod3Tag.rectTransform, new Vector2(0, 0), new Vector2(0.7f, 1), Vector2.zero, Vector2.zero);
        mod3Tag.alignment = TextAnchor.MiddleLeft;

        Text mod3Chip = CreateText(mod3TagRow.transform, "Mod3Chip", "● 24/7 STANDBY", 17, FontStyle.Bold, new Color(1f, 0.45f, 0.45f, 1f), regularFont);
        SetRect(mod3Chip.rectTransform, new Vector2(0.65f, 0), new Vector2(1f, 1), Vector2.zero, Vector2.zero);
        mod3Chip.alignment = TextAnchor.MiddleRight;

        // Title (top: 64, height: 42)
        Text mod3Title = CreateText(mod3.transform, "Mod3Title", "Emergency SOS & Evacuation", 34, FontStyle.Bold, textWhite, regularFont);
        RectTransform m3TitleRt = mod3Title.rectTransform;
        m3TitleRt.anchorMin = new Vector2(0.5f, 1f);
        m3TitleRt.anchorMax = new Vector2(0.5f, 1f);
        m3TitleRt.pivot = new Vector2(0.5f, 1f);
        m3TitleRt.anchoredPosition = new Vector2(0, -64);
        m3TitleRt.sizeDelta = new Vector2(930, 42);
        mod3Title.alignment = TextAnchor.MiddleLeft;

        // Description (top: 118, height: 68)
        Text mod3Desc = CreateText(mod3.transform, "Mod3Desc", "Instantly broadcast distress coordinates to mine rescue control center and trigger shaft evacuation sirens.", 20, FontStyle.Normal, textMuted, regularFont);
        RectTransform m3DescRt = mod3Desc.rectTransform;
        m3DescRt.anchorMin = new Vector2(0.5f, 1f);
        m3DescRt.anchorMax = new Vector2(0.5f, 1f);
        m3DescRt.pivot = new Vector2(0.5f, 1f);
        m3DescRt.anchoredPosition = new Vector2(0, -118);
        m3DescRt.sizeDelta = new Vector2(930, 68);
        mod3Desc.alignment = TextAnchor.UpperLeft;
        mod3Desc.lineSpacing = 1.2f;

        // Action CTA Button
        Button btnSOS = CreateButton(mod3.transform, "SOSButton", "🚨 TRIGGER SOS DISTRESS", 28, regularFont, btnRed, Vector2.zero, new Vector2(930, 92), textWhite);
        RectTransform sosBtnRt = btnSOS.GetComponent<RectTransform>();
        sosBtnRt.anchorMin = new Vector2(0.5f, 0f);
        sosBtnRt.anchorMax = new Vector2(0.5f, 0f);
        sosBtnRt.pivot = new Vector2(0.5f, 0f);
        sosBtnRt.anchoredPosition = new Vector2(0, 24);

        // -------------------------------------------------------------
        // MODULE 4: SHIFT STATUS & DGMS COMPLIANCE CARD (Height: 185)
        // -------------------------------------------------------------
        GameObject shiftCard = CreatePanel(contentRt, "ShiftSafetyCard", panelSprite, new Color(0.09f, 0.13f, 0.20f, 0.98f),
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -1140), new Vector2(1000, 185));
        RectTransform shiftRt = shiftCard.GetComponent<RectTransform>();
        shiftRt.pivot = new Vector2(0.5f, 1f);

        // Header Row (top: 22, height: 30)
        GameObject sHeadRow = new GameObject("HeaderRow");
        sHeadRow.transform.SetParent(shiftCard.transform, false);
        RectTransform sHeadRt = sHeadRow.AddComponent<RectTransform>();
        sHeadRt.anchorMin = new Vector2(0.5f, 1f);
        sHeadRt.anchorMax = new Vector2(0.5f, 1f);
        sHeadRt.pivot = new Vector2(0.5f, 1f);
        sHeadRt.anchoredPosition = new Vector2(0, -22);
        sHeadRt.sizeDelta = new Vector2(930, 30);

        Text shiftHead = CreateText(sHeadRow.transform, "ShiftHead", "● DGMS SAFETY COMPLIANT • SCORE: 98%", 21, FontStyle.Bold, new Color(0.2f, 0.85f, 0.5f, 1f), regularFont);
        SetRect(shiftHead.rectTransform, new Vector2(0, 0), new Vector2(0.7f, 1), Vector2.zero, Vector2.zero);
        shiftHead.alignment = TextAnchor.MiddleLeft;

        Text shiftBadge = CreateText(sHeadRow.transform, "ShiftBadge", "DAY SHIFT • SEC-4", 18, FontStyle.Bold, textGold, regularFont);
        SetRect(shiftBadge.rectTransform, new Vector2(0.65f, 0), new Vector2(1f, 1), Vector2.zero, Vector2.zero);
        shiftBadge.alignment = TextAnchor.MiddleRight;

        // Line 2: Telemetry (top: 60, height: 28)
        Text telemetryText = CreateText(shiftCard.transform, "Telemetry", "Connected to Mine Rescue Telemetry  •  Tunnel Sensors: Normal  •  O2: 20.9%", 18, FontStyle.Bold, new Color(0.4f, 0.75f, 1f, 1f), regularFont);
        RectTransform telRt = telemetryText.rectTransform;
        telRt.anchorMin = new Vector2(0.5f, 1f);
        telRt.anchorMax = new Vector2(0.5f, 1f);
        telRt.pivot = new Vector2(0.5f, 1f);
        telRt.anchoredPosition = new Vector2(0, -60);
        telRt.sizeDelta = new Vector2(930, 28);
        telemetryText.alignment = TextAnchor.MiddleLeft;

        // Line 3: Shift info (top: 96, height: 26)
        Text shiftSub = CreateText(shiftCard.transform, "ShiftSub", "Shift: Day Trainee #01  •  Zone: Underground Sector 4  •  Ventilation: 100%", 17, FontStyle.Normal, textMuted, regularFont);
        RectTransform subRt = shiftSub.rectTransform;
        subRt.anchorMin = new Vector2(0.5f, 1f);
        subRt.anchorMax = new Vector2(0.5f, 1f);
        subRt.pivot = new Vector2(0.5f, 1f);
        subRt.anchoredPosition = new Vector2(0, -96);
        subRt.sizeDelta = new Vector2(930, 26);
        shiftSub.alignment = TextAnchor.MiddleLeft;

        // Line 4: Emergency Hotline (top: 132, height: 28)
        Text hotlineText = CreateText(shiftCard.transform, "HotlineText", "📞 DGMS EMERGENCY DISPATCH: 112 / 108   •   MINE CONTROL: EXT-404", 17, FontStyle.Bold, textGold, regularFont);
        RectTransform hotRt = hotlineText.rectTransform;
        hotRt.anchorMin = new Vector2(0.5f, 1f);
        hotRt.anchorMax = new Vector2(0.5f, 1f);
        hotRt.pivot = new Vector2(0.5f, 1f);
        hotRt.anchoredPosition = new Vector2(0, -132);
        hotRt.sizeDelta = new Vector2(930, 28);
        hotlineText.alignment = TextAnchor.MiddleLeft;

        // Footer Compliance Note
        Text footerText = CreateText(contentRt, "FooterCompliance", "JohAR Mining Safety Portal • Govt. of Jharkhand • Emergency: 112 / 108", 16, FontStyle.Normal, new Color(0.45f, 0.52f, 0.65f, 1f), regularFont);
        RectTransform footRt = footerText.rectTransform;
        footRt.anchorMin = new Vector2(0.5f, 1f);
        footRt.anchorMax = new Vector2(0.5f, 1f);
        footRt.pivot = new Vector2(0.5f, 1f);
        footRt.anchoredPosition = new Vector2(0, -1345);
        footRt.sizeDelta = new Vector2(1000, 28);
        footerText.alignment = TextAnchor.MiddleCenter;

        // -------------------------------------------------------------
        // FEEDBACK MODAL (High-End Industrial Alert Dialog)
        // -------------------------------------------------------------
        GameObject modalObj = CreatePanel(canvas.transform, "FeedbackModal", null, new Color(0f, 0f, 0f, 0.85f),
            Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        modalObj.SetActive(false);

        // Modal Box
        GameObject modalBox = CreatePanel(modalObj.transform, "ModalBox", panelSprite, new Color(0.12f, 0.16f, 0.25f, 0.99f),
            new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(920, 520));

        Text modalTitle = CreateText(modalBox.transform, "ModalTitle", "NOTIFICATION", 34, FontStyle.Bold, textGold, regularFont);
        SetRect(modalTitle.rectTransform, new Vector2(0, 1), new Vector2(1, 1), new Vector2(40, -45), new Vector2(-80, 48));
        modalTitle.alignment = TextAnchor.MiddleCenter;

        Text modalBody = CreateText(modalBox.transform, "ModalBody", "Your notification content here...", 25, FontStyle.Normal, textWhite, regularFont);
        SetRect(modalBody.rectTransform, new Vector2(0, 0), new Vector2(1, 1), new Vector2(50, -95), new Vector2(-100, -180));
        modalBody.alignment = TextAnchor.MiddleCenter;

        Button modalCloseBtn = CreateButton(modalBox.transform, "ModalCloseBtn", "DISMISS", 28, regularFont, btnGreen, new Vector2(0, -185), new Vector2(380, 88), textWhite);

        // Hook up HomeManager
        var hm = Object.FindAnyObjectByType<HomeManager>();
        if (hm == null)
        {
            GameObject logicObj = new GameObject("HomeManager");
            hm = logicObj.AddComponent<HomeManager>();
        }

        hm.welcomeText = welcomeText;
        hm.roleBadgeText = roleBadge;
        hm.logoutButton = logoutBtn;
        hm.langSwitchButton = langToggleBtn;
        hm.langSwitchButtonText = langToggleBtn.GetComponentInChildren<Text>();
        hm.startFireSafetyButton = btnStartFire;
        hm.startFireSafetyButtonText = fireBtnText;
        hm.module1TitleText = mod1Title;
        hm.module1DescText = mod1Desc;
        hm.reportHazardButton = btnReportHazard;
        hm.reportHazardButtonText = btnReportHazard.GetComponentInChildren<Text>();
        hm.module2TitleText = mod2Title;
        hm.module2DescText = mod2Desc;
        hm.sosButton = btnSOS;
        hm.sosButtonText = btnSOS.GetComponentInChildren<Text>();
        hm.module3TitleText = mod3Title;
        hm.module3DescText = mod3Desc;
        hm.feedbackModal = modalObj;
        hm.feedbackTitleText = modalTitle;
        hm.feedbackBodyText = modalBody;
        hm.feedbackCloseButton = modalCloseBtn;

        EditorUtility.SetDirty(hm);
        EditorSceneManager.SaveScene(canvas.gameObject.scene, path);
    }

    // =========================================================================
    // 2_FIRESAFETYAR SCENE (Widescreen Landscape)
    // =========================================================================
    static void BuildARScene(Font titleFont, Font regularFont, Sprite btnGreen, Sprite btnYellow, Sprite btnRed, Sprite panelGlass, Sprite panelBorder, Sprite starSprite)
    {
        string path = "Assets/Scenes/2_FireSafetyAR.unity";
        Canvas canvas = PrepareSceneCanvas(path, new Vector2(1920, 1080), 0.5f);

        // Top Status HUD Pill (Top Left) - Safe top margin (-70px)
        GameObject statusPill = CreatePanel(canvas.transform, "StatusPill", panelGlass, new Color(0.08f, 0.12f, 0.18f, 0.90f),
            new Vector2(0f, 1f), new Vector2(0f, 1f), new Vector2(180, -70), new Vector2(260, 52));
        
        Text statusText = CreateText(statusPill.transform, "StatusText", "● LIVE AR CAMERA", 18, FontStyle.Bold, new Color(0.2f, 0.9f, 0.5f, 1f), regularFont);
        SetRect(statusText.rectTransform, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        statusText.alignment = TextAnchor.MiddleCenter;

        // Top Center Instruction Banner - Safe top margin (-70px)
        GameObject instBanner = CreatePanel(canvas.transform, "InstructionGlassPanel", panelGlass, new Color(0.06f, 0.10f, 0.16f, 0.95f),
            new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -70), new Vector2(1050, 76));

        // Step Badge Pill
        GameObject stepBadgeObj = CreatePanel(instBanner.transform, "StepBadge", panelBorder, new Color(0.18f, 0.25f, 0.38f, 1f),
            new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(95, 0), new Vector2(150, 44));
        
        Text stepBadgeText = CreateText(stepBadgeObj.transform, "StepBadgeText", "STEP 1/3", 18, FontStyle.Bold, textGold, titleFont != null ? titleFont : regularFont);
        SetRect(stepBadgeText.rectTransform, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        stepBadgeText.alignment = TextAnchor.MiddleCenter;

        // Instruction Text
        Text instText = CreateText(instBanner.transform, "InstructionText", "Tap on the floor to spawn fire", 24, FontStyle.Bold, textWhite, regularFont);
        SetRect(instText.rectTransform, new Vector2(0, 0), new Vector2(1, 1), new Vector2(185, 0), new Vector2(-20, 0));
        instText.alignment = TextAnchor.MiddleLeft;

        // Top Right Fire Threat Health Gauge - Sleek, modern, clear HUD
        GameObject threatContainer = CreatePanel(canvas.transform, "FireThreatHUD", panelGlass, new Color(0.08f, 0.12f, 0.18f, 0.92f),
            new Vector2(1f, 1f), new Vector2(1f, 1f), new Vector2(-220, -70), new Vector2(360, 54));
        threatContainer.SetActive(false);

        Text threatLabel = CreateText(threatContainer.transform, "ThreatLabel", "🔥 THREAT", 15, FontStyle.Bold, new Color(1f, 0.45f, 0.4f, 1f), regularFont);
        SetRect(threatLabel.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), new Vector2(55, 0), new Vector2(90, 36));
        threatLabel.alignment = TextAnchor.MiddleCenter;

        // Progress Bar Track
        GameObject trackObj = CreatePanel(threatContainer.transform, "ThreatTrack", panelBorder, new Color(0.12f, 0.16f, 0.24f, 1f),
            new Vector2(0, 0.5f), new Vector2(0, 0.5f), new Vector2(185, 0), new Vector2(160, 20));

        // Progress Bar Fill (Vibrant Smooth Bar)
        GameObject fillObj = new GameObject("ThreatFill");
        fillObj.transform.SetParent(trackObj.transform);
        RectTransform fillRt = fillObj.AddComponent<RectTransform>();
        SetRect(fillRt, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);

        Image fillImg = fillObj.AddComponent<Image>();
        fillImg.sprite = btnRed;
        fillImg.type = Image.Type.Filled;
        fillImg.fillMethod = Image.FillMethod.Horizontal;
        fillImg.fillOrigin = (int)Image.OriginHorizontal.Left;
        fillImg.fillAmount = 1f;
        fillImg.color = new Color(0.95f, 0.25f, 0.2f, 1f);
        fillImg.raycastTarget = false;

        // Percentage Text
        Text percentText = CreateText(threatContainer.transform, "PercentText", "100%", 15, FontStyle.Bold, new Color(1f, 0.85f, 0.85f, 1f), regularFont);
        SetRect(percentText.rectTransform, new Vector2(0, 0.5f), new Vector2(0, 0.5f), new Vector2(310, 0), new Vector2(60, 36));
        percentText.alignment = TextAnchor.MiddleCenter;

        // Bottom Center Back Button (fallback)
        Button backBtn = CreateButton(canvas.transform, "BackHomeButton", "BACK TO DASHBOARD", 24, regularFont, btnGreen, new Vector2(0, 50), new Vector2(400, 70));
        backBtn.gameObject.SetActive(false);

        // -------------------------------------------------------------
        // VICTORY DEBRIEF MODAL (Spacious, modern, perfectly structured)
        // -------------------------------------------------------------
        GameObject victoryModal = CreatePanel(canvas.transform, "VictoryModal", panelBorder, new Color(0.05f, 0.08f, 0.14f, 0.98f),
            new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(880, 540));
        victoryModal.SetActive(false);

        // Stars row (Top of modal)
        GameObject starsRow = new GameObject("StarsRow");
        starsRow.transform.SetParent(victoryModal.transform);
        RectTransform starsRt = starsRow.AddComponent<RectTransform>();
        SetRect(starsRt, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -75), new Vector2(220, 65));

        CreateImage(starsRow.transform, "Star1", starSprite, Color.white, new Vector2(0.2f, 0.5f), new Vector2(0.2f, 0.5f), Vector2.zero, new Vector2(48, 48));
        CreateImage(starsRow.transform, "Star2", starSprite, Color.white, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(64, 64));
        CreateImage(starsRow.transform, "Star3", starSprite, Color.white, new Vector2(0.8f, 0.5f), new Vector2(0.8f, 0.5f), Vector2.zero, new Vector2(48, 48));

        // Title
        Text vicTitle = CreateText(victoryModal.transform, "VictoryTitle", "DRILL COMPLETE • FIRE OUT!", 28, FontStyle.Bold, textGold, titleFont != null ? titleFont : regularFont);
        SetRect(vicTitle.rectTransform, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -145), new Vector2(800, 44));
        vicTitle.alignment = TextAnchor.MiddleCenter;

        // Stats Card Container (Middle of modal)
        GameObject statsContainer = CreatePanel(victoryModal.transform, "StatsContainer", panelBorder, new Color(0.08f, 0.12f, 0.18f, 0.9f),
            new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0, 10), new Vector2(760, 110));

        Text vicSubtitle = CreateText(statsContainer.transform, "VictorySubtitle", "P.A.S.S. Protocol Successfully Executed!\nTime: 14.9s  •  Safety Score: 100/100  •  Rating: ★★★", 22, FontStyle.Normal, textWhite, regularFont);
        SetRect(vicSubtitle.rectTransform, Vector2.zero, Vector2.one, new Vector2(20, 10), new Vector2(-20, -10));
        vicSubtitle.alignment = TextAnchor.MiddleCenter;
        vicSubtitle.lineSpacing = 1.3f;

        // Return Button (Bottom of modal with ReturnToHome component)
        Button vicReturnBtn = CreateButton(victoryModal.transform, "VictoryBackButton", "RETURN TO DASHBOARD", 24, titleFont != null ? titleFont : regularFont, btnGreen, new Vector2(0, -170), new Vector2(480, 76));

        // Hook up ARFireManager
        var fm = Object.FindAnyObjectByType<ARFireManager>();
        if (fm != null)
        {
            fm.instructionText = instText;
            fm.stepBadgeText = stepBadgeText;
            fm.fireHealthFillImage = fillImg;
            fm.fireHealthPercentText = percentText;
            fm.fireHealthContainer = threatContainer;
            fm.victoryModal = victoryModal;
            fm.victoryTitleText = vicTitle;
            fm.victorySubtitleText = vicSubtitle;
            fm.victoryBackButton = vicReturnBtn;

            var vo = fm.GetComponent<DrillVoiceoverManager>();
            if (vo == null)
            {
                vo = fm.gameObject.AddComponent<DrillVoiceoverManager>();
            }

            LinkVoiceovers(vo);

            EditorUtility.SetDirty(fm);
        }

        EditorSceneManager.SaveScene(canvas.gameObject.scene, path);
    }

    static void LinkVoiceovers(DrillVoiceoverManager vo)
    {
        if (vo == null) return;
        string[] steps = {
            "vo_step0_spawn_fire",
            "vo_step1_remove_seal",
            "vo_step2_pull_pin",
            "vo_step3_aim_squeeze",
            "vo_step4_spraying",
            "vo_step5_victory"
        };

        vo.englishClips = new AudioClip[steps.Length];
        vo.hindiClips = new AudioClip[steps.Length];

        for (int i = 0; i < steps.Length; i++)
        {
            vo.englishClips[i] = AssetDatabase.LoadAssetAtPath<AudioClip>($"Assets/Audio/Voiceovers/English/{steps[i]}.mp3");
            if (vo.englishClips[i] == null)
                vo.englishClips[i] = AssetDatabase.LoadAssetAtPath<AudioClip>($"Assets/Audio/Voiceovers/English/{steps[i]}.wav");

            vo.hindiClips[i] = AssetDatabase.LoadAssetAtPath<AudioClip>($"Assets/Audio/Voiceovers/Hindi/{steps[i]}.mp3");
            if (vo.hindiClips[i] == null)
                vo.hindiClips[i] = AssetDatabase.LoadAssetAtPath<AudioClip>($"Assets/Audio/Voiceovers/Hindi/{steps[i]}.wav");
        }

        EditorUtility.SetDirty(vo);
        Debug.Log("<b>[RebuildAppUI] Audio Voiceovers successfully linked for English and Hindi!</b>");
    }

    // =========================================================================
    // UI COMPONENT HELPERS
    // =========================================================================
    static GameObject CreatePanel(Transform parent, string name, Sprite sprite, Color color, Vector2 anchorMin, Vector2 anchorMax, Vector2 pos, Vector2 size)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent);
        RectTransform rt = obj.AddComponent<RectTransform>();
        SetRect(rt, anchorMin, anchorMax, pos, size);

        Image img = obj.AddComponent<Image>();
        if (sprite != null)
        {
            img.sprite = sprite;
            img.type = Image.Type.Sliced;
        }
        img.color = color;
        img.raycastTarget = false; // Never block button clicks!

        return obj;
    }

    static GameObject CreateImage(Transform parent, string name, Sprite sprite, Color color, Vector2 anchorMin, Vector2 anchorMax, Vector2 pos, Vector2 size)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent);
        RectTransform rt = obj.AddComponent<RectTransform>();
        SetRect(rt, anchorMin, anchorMax, pos, size);

        Image img = obj.AddComponent<Image>();
        if (sprite != null)
        {
            img.sprite = sprite;
            img.type = (sprite.border != Vector4.zero) ? Image.Type.Sliced : Image.Type.Simple;
        }
        img.color = color;
        img.raycastTarget = false;

        return obj;
    }

    static Text CreateText(Transform parent, string name, string text, int fontSize, FontStyle style, Color color, Font font)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent);
        RectTransform rt = obj.AddComponent<RectTransform>();
        
        Text t = obj.AddComponent<Text>();
        t.text = text;
        t.fontSize = fontSize;
        t.fontStyle = style;
        t.color = color;
        if (font != null) t.font = font;
        t.raycastTarget = false;

        return t;
    }

    static GameObject CreatePillChip(Transform parent, string name, string label, Sprite bgSprite, Color bgColor, Color textColor, Font font, Vector2 pos, Vector2 size)
    {
        GameObject chip = CreatePanel(parent, name, bgSprite, bgColor, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), pos, size);
        Text t = CreateText(chip.transform, "Label", label, 16, FontStyle.Bold, textColor, font);
        SetRect(t.rectTransform, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
        t.alignment = TextAnchor.MiddleCenter;
        return chip;
    }

    static Button CreateButton(Transform parent, string name, string label, int fontSize, Font font, Sprite sprite, Vector2 pos, Vector2 size, Color? textColorOverride = null)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent);
        RectTransform rt = obj.AddComponent<RectTransform>();
        SetRect(rt, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), pos, size);

        Image img = obj.AddComponent<Image>();
        if (sprite != null)
        {
            img.sprite = sprite;
            img.type = Image.Type.Sliced;
        }
        img.color = Color.white;
        img.raycastTarget = true; // Button MUST receive raycasts

        Button btn = obj.AddComponent<Button>();
        btn.targetGraphic = img;

        // Visual click feedback
        var colors = btn.colors;
        colors.highlightedColor = new Color(0.9f, 0.95f, 1f, 1f);
        colors.pressedColor = new Color(0.75f, 0.85f, 0.95f, 1f);
        btn.colors = colors;

        // Auto-attach ReturnToHome only for AR screen return to dashboard button
        if (name.ToLower().Contains("victoryback") || name.ToLower().Contains("backhome"))
        {
            if (obj.GetComponent<ReturnToHome>() == null)
                obj.AddComponent<ReturnToHome>();
        }

        GameObject textObj = new GameObject("Text");
        textObj.transform.SetParent(obj.transform);
        RectTransform textRt = textObj.AddComponent<RectTransform>();
        SetRect(textRt, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);

        Text t = textObj.AddComponent<Text>();
        t.text = label;
        t.fontSize = fontSize;
        t.fontStyle = FontStyle.Bold;

        // High contrast text colors: Dark text on light/grey/yellow buttons, white text on colored buttons
        Color textColor = textWhite;
        if (textColorOverride.HasValue)
        {
            textColor = textColorOverride.Value;
        }
        else if (sprite != null && (sprite.name.ToLower().Contains("grey") || sprite.name.ToLower().Contains("flat") || sprite.name.ToLower().Contains("input") || sprite.name.ToLower().Contains("white")))
        {
            textColor = new Color(0.12f, 0.16f, 0.24f, 1f); // Dark Charcoal for 100% visibility on light buttons
        }
        else if (sprite != null && sprite.name.ToLower().Contains("yellow"))
        {
            textColor = new Color(0.12f, 0.08f, 0.02f, 1f); // Dark Amber on Yellow
        }
        t.color = textColor;

        if (font != null) t.font = font;
        t.alignment = TextAnchor.MiddleCenter;
        t.raycastTarget = false;

        return btn;
    }

    static void SetRect(RectTransform rt, Vector2 anchorMin, Vector2 anchorMax, Vector2 anchoredPos, Vector2 sizeDelta)
    {
        rt.anchorMin = anchorMin;
        rt.anchorMax = anchorMax;
        rt.anchoredPosition = anchoredPos;
        rt.sizeDelta = sizeDelta;
        rt.localScale = Vector3.one;
        rt.localRotation = Quaternion.identity;
    }
}
