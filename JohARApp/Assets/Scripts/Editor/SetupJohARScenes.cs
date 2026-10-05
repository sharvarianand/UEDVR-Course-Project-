using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class SetupJohARScenes : EditorWindow
{
    [MenuItem("JohAR/Setup Scenes")]
    public static void ShowWindow()
    {
        GetWindow<SetupJohARScenes>("Setup JohAR Scenes");
    }

    private void OnGUI()
    {
        if (GUILayout.Button("Create All Scenes"))
        {
            CreateScenes();
        }
    }

    private static void CreateScenes()
    {
        string scenePath0 = "Assets/Scenes/0_Login.unity";
        string scenePath1 = "Assets/Scenes/1_Home.unity";
        string scenePath2 = "Assets/Scenes/2_FireSafetyAR.unity";

        // Create 0_Login
        Scene loginScene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        GameObject camera = new GameObject("Main Camera");
        camera.AddComponent<Camera>();
        
        GameObject eventSystem = new GameObject("EventSystem");
        eventSystem.AddComponent<EventSystem>();
#if ENABLE_INPUT_SYSTEM
        eventSystem.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
        eventSystem.AddComponent<StandaloneInputModule>();
#endif

        GameObject canvas = new GameObject("Canvas");
        Canvas c = canvas.AddComponent<Canvas>();
        c.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.AddComponent<CanvasScaler>();
        canvas.AddComponent<GraphicRaycaster>();

        GameObject title = new GameObject("TitleText");
        title.transform.SetParent(canvas.transform);
        Text titleText = title.AddComponent<Text>();
        titleText.text = "JohAR";
        titleText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        titleText.fontSize = 48;
        titleText.alignment = TextAnchor.MiddleCenter;
        title.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 200);
        title.GetComponent<RectTransform>().sizeDelta = new Vector2(400, 100);

        GameObject inputFieldObj = DefaultControls.CreateInputField(new DefaultControls.Resources());
        inputFieldObj.transform.SetParent(canvas.transform);
        inputFieldObj.name = "WorkerIDInput";
        inputFieldObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 50);
        InputField inputField = inputFieldObj.GetComponent<InputField>();

        GameObject hindiBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        hindiBtnObj.transform.SetParent(canvas.transform);
        hindiBtnObj.name = "HindiButton";
        hindiBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -20);
        hindiBtnObj.GetComponentInChildren<Text>().text = "Hindi";
        Button hindiBtn = hindiBtnObj.GetComponent<Button>();

        GameObject santaliBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        santaliBtnObj.transform.SetParent(canvas.transform);
        santaliBtnObj.name = "SantaliButton";
        santaliBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -70);
        santaliBtnObj.GetComponentInChildren<Text>().text = "Santali";
        Button santaliBtn = santaliBtnObj.GetComponent<Button>();

        GameObject englishBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        englishBtnObj.transform.SetParent(canvas.transform);
        englishBtnObj.name = "EnglishButton";
        englishBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -120);
        englishBtnObj.GetComponentInChildren<Text>().text = "English";
        Button englishBtn = englishBtnObj.GetComponent<Button>();

        GameObject loginManagerObj = new GameObject("LoginManager");
        LoginManager loginManager = loginManagerObj.AddComponent<LoginManager>();
        loginManager.workerIdInput = inputField;
        loginManager.hindiButton = hindiBtn;
        loginManager.santaliButton = santaliBtn;
        loginManager.englishButton = englishBtn;

        GameObject langManagerObj = new GameObject("LanguageManager");
        langManagerObj.AddComponent<LanguageManager>();

        EditorSceneManager.SaveScene(loginScene, scenePath0);

        // Create 1_Home
        Scene homeScene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        GameObject hCamera = new GameObject("Main Camera");
        hCamera.AddComponent<Camera>();

        GameObject hEventSystem = new GameObject("EventSystem");
        hEventSystem.AddComponent<EventSystem>();
#if ENABLE_INPUT_SYSTEM
        hEventSystem.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
        hEventSystem.AddComponent<StandaloneInputModule>();
#endif

        GameObject hCanvas = new GameObject("Canvas");
        Canvas hc = hCanvas.AddComponent<Canvas>();
        hc.renderMode = RenderMode.ScreenSpaceOverlay;
        hCanvas.AddComponent<CanvasScaler>();
        hCanvas.AddComponent<GraphicRaycaster>();

        GameObject welcomeTitle = new GameObject("WelcomeText");
        welcomeTitle.transform.SetParent(hCanvas.transform);
        Text wText = welcomeTitle.AddComponent<Text>();
        wText.text = "Welcome!";
        wText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        wText.fontSize = 32;
        wText.alignment = TextAnchor.MiddleCenter;
        welcomeTitle.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 200);
        welcomeTitle.GetComponent<RectTransform>().sizeDelta = new Vector2(400, 100);

        GameObject fireBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        fireBtnObj.transform.SetParent(hCanvas.transform);
        fireBtnObj.name = "StartFireSafetyButton";
        fireBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 50);
        fireBtnObj.GetComponent<RectTransform>().sizeDelta = new Vector2(250, 50);
        fireBtnObj.GetComponentInChildren<Text>().text = "Start Fire Safety AR";
        Button fireBtn = fireBtnObj.GetComponent<Button>();

        GameObject hazardBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        hazardBtnObj.transform.SetParent(hCanvas.transform);
        hazardBtnObj.name = "ReportHazardButton";
        hazardBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -20);
        hazardBtnObj.GetComponent<RectTransform>().sizeDelta = new Vector2(250, 50);
        hazardBtnObj.GetComponentInChildren<Text>().text = "Report Hazard";
        Button hazardBtn = hazardBtnObj.GetComponent<Button>();

        GameObject sosBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        sosBtnObj.transform.SetParent(hCanvas.transform);
        sosBtnObj.name = "SOSButton";
        sosBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -90);
        sosBtnObj.GetComponent<RectTransform>().sizeDelta = new Vector2(250, 50);
        sosBtnObj.GetComponentInChildren<Text>().text = "SOS";
        Button sosBtn = sosBtnObj.GetComponent<Button>();

        GameObject homeManagerObj = new GameObject("HomeManager");
        HomeManager homeManager = homeManagerObj.AddComponent<HomeManager>();
        homeManager.welcomeText = wText;
        homeManager.startFireSafetyButton = fireBtn;
        homeManager.reportHazardButton = hazardBtn;
        homeManager.sosButton = sosBtn;

        EditorSceneManager.SaveScene(homeScene, scenePath1);

        // Create 2_FireSafetyAR
        Scene arScene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        
        // Setup simple AR hierarchy (mocked due to missing AR Foundation package reference in basic build)
        // We will create the UI anyway
        GameObject arEventSystem = new GameObject("EventSystem");
        arEventSystem.AddComponent<EventSystem>();
#if ENABLE_INPUT_SYSTEM
        arEventSystem.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
        arEventSystem.AddComponent<StandaloneInputModule>();
#endif

        GameObject arCanvas = new GameObject("Canvas");
        Canvas arc = arCanvas.AddComponent<Canvas>();
        arc.renderMode = RenderMode.ScreenSpaceOverlay;
        arCanvas.AddComponent<CanvasScaler>();
        arCanvas.AddComponent<GraphicRaycaster>();

        GameObject arInstTextObj = new GameObject("InstructionText");
        arInstTextObj.transform.SetParent(arCanvas.transform);
        Text arInstText = arInstTextObj.AddComponent<Text>();
        arInstText.text = "AR Instructions";
        arInstText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        arInstText.fontSize = 24;
        arInstText.alignment = TextAnchor.UpperCenter;
        arInstTextObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -50);
        arInstTextObj.GetComponent<RectTransform>().anchorMin = new Vector2(0.5f, 1);
        arInstTextObj.GetComponent<RectTransform>().anchorMax = new Vector2(0.5f, 1);
        arInstTextObj.GetComponent<RectTransform>().sizeDelta = new Vector2(600, 100);

        GameObject extinguisherPanel = new GameObject("ExtinguisherPanel");
        extinguisherPanel.transform.SetParent(arCanvas.transform);
        extinguisherPanel.AddComponent<Image>().color = new Color(0,0,0,0.5f);
        extinguisherPanel.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 100);
        extinguisherPanel.GetComponent<RectTransform>().anchorMin = new Vector2(0, 0);
        extinguisherPanel.GetComponent<RectTransform>().anchorMax = new Vector2(1, 0);
        extinguisherPanel.GetComponent<RectTransform>().sizeDelta = new Vector2(0, 200);

        GameObject extBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        extBtnObj.transform.SetParent(extinguisherPanel.transform);
        extBtnObj.name = "ExtinguishButton";
        extBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 0);
        extBtnObj.GetComponent<RectTransform>().sizeDelta = new Vector2(200, 60);
        extBtnObj.GetComponentInChildren<Text>().text = "Extinguish Fire";
        Button extBtn = extBtnObj.GetComponent<Button>();

        GameObject backBtnObj = DefaultControls.CreateButton(new DefaultControls.Resources());
        backBtnObj.transform.SetParent(extinguisherPanel.transform);
        backBtnObj.name = "BackHomeButton";
        backBtnObj.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, 0);
        backBtnObj.GetComponent<RectTransform>().sizeDelta = new Vector2(200, 60);
        backBtnObj.GetComponentInChildren<Text>().text = "Back to Home";
        Button backBtn = backBtnObj.GetComponent<Button>();

        GameObject firePrefab = GameObject.CreatePrimitive(PrimitiveType.Cube);
        firePrefab.GetComponent<Renderer>().sharedMaterial = new Material(Shader.Find("Standard"));
        firePrefab.GetComponent<Renderer>().sharedMaterial.color = Color.red;
        firePrefab.name = "VirtualFirePrefab";
        
        string prefabPath = "Assets/Prefabs/AR/VirtualFirePrefab.prefab";
        if (!System.IO.Directory.Exists("Assets/Prefabs/AR")) {
            System.IO.Directory.CreateDirectory("Assets/Prefabs/AR");
        }
        GameObject savedPrefab = PrefabUtility.SaveAsPrefabAsset(firePrefab, prefabPath);
        DestroyImmediate(firePrefab);

        GameObject arManagerObj = new GameObject("ARFireManager");
        ARFireManager arFireManager = arManagerObj.AddComponent<ARFireManager>();
        arFireManager.instructionText = arInstText;
        arFireManager.firePrefab = savedPrefab;

        GameObject extLogicObj = new GameObject("FireExtinguisherLogic");
        FireExtinguisher fireExt = extLogicObj.AddComponent<FireExtinguisher>();
        fireExt.fireManager = arFireManager;
        fireExt.extinguishButton = extBtn;
        fireExt.backHomeButton = backBtn;

        EditorSceneManager.SaveScene(arScene, scenePath2);

        // Add scenes to build settings
        EditorBuildSettingsScene[] buildScenes = new EditorBuildSettingsScene[3];
        buildScenes[0] = new EditorBuildSettingsScene(scenePath0, true);
        buildScenes[1] = new EditorBuildSettingsScene(scenePath1, true);
        buildScenes[2] = new EditorBuildSettingsScene(scenePath2, true);
        EditorBuildSettings.scenes = buildScenes;
        
        Debug.Log("Successfully created all JohAR scenes!");
    }
}
