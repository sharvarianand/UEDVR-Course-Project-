using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.XR.ARFoundation;

#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem.UI;
#endif

public class ApplyUltimateFix
{
    [MenuItem("JohAR/Apply Ultimate Fixes")]
    public static void Fix()
    {
        // ==========================================
        // 1. FIX LOGIN SCENE (Replace Dropdown with Buttons)
        // ==========================================
        Scene loginScene = EditorSceneManager.OpenScene("Assets/Scenes/0_Login.unity", OpenSceneMode.Single);
        
        Canvas canvas = Object.FindAnyObjectByType<Canvas>();
        if (canvas != null)
        {
            var dropdown = Object.FindAnyObjectByType<Dropdown>();
            if (dropdown != null) Object.DestroyImmediate(dropdown.gameObject);
            
            var buttons = Object.FindObjectsByType<Button>(FindObjectsInactive.Include);
            bool alreadyFixed = false;
            foreach (var b in buttons)
            {
                if (b.name == "LoginButton") Object.DestroyImmediate(b.gameObject);
                if (b.name == "HindiButton") alreadyFixed = true;
            }

            if (!alreadyFixed)
            {
                GameObject hindiObj = DefaultControls.CreateButton(new DefaultControls.Resources());
                hindiObj.name = "HindiButton";
                hindiObj.transform.SetParent(canvas.transform);
                RectTransform hRt = hindiObj.GetComponent<RectTransform>();
                hRt.sizeDelta = new Vector2(400, 120);
                hRt.anchoredPosition = new Vector2(0, 0);
                hindiObj.GetComponentInChildren<Text>().text = "Hindi";
                hindiObj.GetComponentInChildren<Text>().fontSize = 48;

                GameObject santaliObj = DefaultControls.CreateButton(new DefaultControls.Resources());
                santaliObj.name = "SantaliButton";
                santaliObj.transform.SetParent(canvas.transform);
                RectTransform sRt = santaliObj.GetComponent<RectTransform>();
                sRt.sizeDelta = new Vector2(400, 120);
                sRt.anchoredPosition = new Vector2(0, -150);
                santaliObj.GetComponentInChildren<Text>().text = "Santali";
                santaliObj.GetComponentInChildren<Text>().fontSize = 48;

                GameObject englishObj = DefaultControls.CreateButton(new DefaultControls.Resources());
                englishObj.name = "EnglishButton";
                englishObj.transform.SetParent(canvas.transform);
                RectTransform eRt = englishObj.GetComponent<RectTransform>();
                eRt.sizeDelta = new Vector2(400, 120);
                eRt.anchoredPosition = new Vector2(0, -300);
                englishObj.GetComponentInChildren<Text>().text = "English";
                englishObj.GetComponentInChildren<Text>().fontSize = 48;

                LoginManager manager = Object.FindAnyObjectByType<LoginManager>();
                if (manager != null)
                {
                    manager.hindiButton = hindiObj.GetComponent<Button>();
                    manager.santaliButton = santaliObj.GetComponent<Button>();
                    manager.englishButton = englishObj.GetComponent<Button>();
                }
            }
        }
        EditorSceneManager.SaveScene(loginScene, "Assets/Scenes/0_Login.unity");

        // ==========================================
        // 2. FIX AR SCENE
        // ==========================================
        Scene arScene = EditorSceneManager.OpenScene("Assets/Scenes/2_FireSafetyAR.unity", OpenSceneMode.Single);
        
        // Check if XR Origin prefab is already present
        var existingXROrigin = Object.FindAnyObjectByType<Unity.XR.CoreUtils.XROrigin>();
        
        if (existingXROrigin == null)
        {
            GameObject oldCam = GameObject.Find("Main Camera");
            if (oldCam != null) Object.DestroyImmediate(oldCam);
            
            var oldSession = Object.FindAnyObjectByType<ARSession>();
            if (oldSession != null) Object.DestroyImmediate(oldSession.gameObject);
        
            GameObject arSessionObj = new GameObject("AR Session");
            arSessionObj.AddComponent<ARSession>();
            arSessionObj.AddComponent<ARInputManager>();

            GameObject xrOriginPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(
                "Assets/Samples/XR Interaction Toolkit/3.5.1/AR Starter Assets/Prefabs/XR Origin (AR Rig).prefab");
            
            if (xrOriginPrefab != null)
            {
                GameObject xrOriginObj = (GameObject)PrefabUtility.InstantiatePrefab(xrOriginPrefab);
                xrOriginObj.name = "XR Origin";
                existingXROrigin = xrOriginObj.GetComponent<Unity.XR.CoreUtils.XROrigin>();
                Debug.Log("XR Origin (AR Rig) prefab instantiated.");
            }
            else
            {
                Debug.LogError("XR Origin (AR Rig) prefab not found!");
            }
        }
        else
        {
            Debug.Log("XR Origin already exists, skipping creation.");
        }
        
        if (existingXROrigin != null)
        {
            GameObject xrOriginObj = existingXROrigin.gameObject;
            
            // Remove any stale ARFireManager objects not on XR Origin
            var allFireManagers = Object.FindObjectsByType<ARFireManager>(FindObjectsInactive.Include);
            foreach (var fm in allFireManagers)
            {
                if (fm.gameObject != xrOriginObj)
                {
                    Object.DestroyImmediate(fm.gameObject);
                }
            }
            
            // Add or get ARFireManager
            ARFireManager fireManager = xrOriginObj.GetComponent<ARFireManager>();
            if (fireManager == null)
                fireManager = xrOriginObj.AddComponent<ARFireManager>();
            
            // Assign NEW fire particle prefab (Vefects)
            GameObject fireParticlePrefab = AssetDatabase.LoadAssetAtPath<GameObject>(
                "Assets/Vefects/Free Fire VFX URP/Particles/VFX_Fire_01_Medium_Simple.prefab");
            if (fireParticlePrefab != null)
            {
                fireManager.firePrefab = fireParticlePrefab;
                Debug.Log("Assigned Vefects Fire to ARFireManager.");
            }
            else
            {
                Debug.LogWarning("Vefects Fire prefab not found!");
            }

            // Assign extinguisher prefab
            GameObject extinguisherPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(
                "Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
            if (extinguisherPrefab != null)
            {
                fireManager.extinguisherPrefab = extinguisherPrefab;
                Debug.Log("Assigned ExtinguisherPrefab to ARFireManager.");
            }
            else
            {
                Debug.LogWarning("ExtinguisherPrefab not found! Run JohAR > Create Extinguisher Prefab first.");
            }
            
            // Assign UI references
            if (fireManager.instructionText == null)
            {
                GameObject textObj = GameObject.Find("InstructionText");
                if (textObj != null)
                    fireManager.instructionText = textObj.GetComponent<Text>();
            }
            
            // Delete ExtinguisherPanel permanently since we use 3D tap now
            GameObject panelObj = GameObject.Find("ExtinguisherPanel");
            if (panelObj != null)
            {
                Object.DestroyImmediate(panelObj);
                Debug.Log("Deleted old ExtinguisherPanel UI. Using 3D tap now.");
            }
            
            // Fix FireExtinguisher reference
            FireExtinguisher ext = Object.FindAnyObjectByType<FireExtinguisher>();
            if (ext != null)
                ext.fireManager = fireManager;

            // Add ARTrackingConfig if not present
            if (xrOriginObj.GetComponent<ARTrackingConfig>() == null)
                xrOriginObj.AddComponent<ARTrackingConfig>();

            // Clean up any stale SprayButton components from ExtinguishButton
            GameObject extBtnObj = GameObject.Find("ExtinguishButton");
            if (extBtnObj != null)
            {
                var staleBtn = extBtnObj.GetComponent("SprayButton");
                if (staleBtn != null) Object.DestroyImmediate(staleBtn);
            }
        }

        // ==========================================
        // 3. FIX EVENT SYSTEM (CRITICAL FOR UI CLICKS)
        // ==========================================
        var eventSystem = Object.FindAnyObjectByType<UnityEngine.EventSystems.EventSystem>();
        if (eventSystem != null)
        {
            if (eventSystem.GetComponent<UnityEngine.EventSystems.BaseInputModule>() == null)
            {
#if ENABLE_INPUT_SYSTEM
                eventSystem.gameObject.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
                eventSystem.gameObject.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
#endif
                Debug.Log("CRITICAL FIX: Added missing Input Module to EventSystem!");
            }
        }

        // Ensure AR Session has ARTrackingConfig too (for session-level settings)
        var arSession2 = Object.FindAnyObjectByType<ARSession>();
        if (arSession2 != null && arSession2.GetComponent<ARTrackingConfig>() == null)
        {
            // Don't double-add, the one on XR Origin is enough
        }

        EditorSceneManager.SaveScene(arScene, "Assets/Scenes/2_FireSafetyAR.unity");
        
        Debug.Log("=== Applied Ultimate Fixes! ===");
        Debug.Log("IMPORTANT: Run 'JohAR > Create Fire Prefab' and 'JohAR > Create Extinguisher Prefab' if you haven't already!");
    }
}
