using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.XR.ARFoundation;

public class ForceFireFix
{
    [MenuItem("JohAR/Force Link Prefabs")]
    public static void Execute()
    {
        var scene = EditorSceneManager.OpenScene("Assets/Scenes/2_FireSafetyAR.unity");
        
        // 1. Configure Camera
        Camera cam = Object.FindAnyObjectByType<Camera>();
        if (cam != null)
        {
            cam.gameObject.tag = "MainCamera";
            
            if (cam.GetComponent<ARCameraManager>() == null)
                cam.gameObject.AddComponent<ARCameraManager>();

            if (cam.GetComponent<ARCameraBackground>() == null)
                cam.gameObject.AddComponent<ARCameraBackground>();

            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Color.black;
            EditorUtility.SetDirty(cam.gameObject);
            Debug.Log("Configured AR Camera with ARCameraBackground and MainCamera tag.");
        }

        // 2. Configure AR Session
        var arSession = Object.FindAnyObjectByType<ARSession>();
        if (arSession == null)
        {
            GameObject sessionObj = new GameObject("AR Session");
            arSession = sessionObj.AddComponent<ARSession>();
            sessionObj.AddComponent<ARInputManager>();
            EditorUtility.SetDirty(sessionObj);
        }

        // 3. Configure ARFireManager and Prefabs
        var fireManager = Object.FindAnyObjectByType<ARFireManager>();
        if (fireManager != null)
        {
            var vefectsPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Vefects/Free Fire VFX URP/Particles/VFX_Fire_01_Medium_Simple.prefab");
            if (vefectsPrefab != null)
            {
                fireManager.firePrefab = vefectsPrefab;
                Debug.Log("SUCCESS: Linked Vefects Fire Prefab");
            }
            
            var extPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
            if (extPrefab != null)
            {
                fireManager.extinguisherPrefab = extPrefab;
                Debug.Log("SUCCESS: Linked Extinguisher Prefab");
            }

            // Ensure Raycast and Plane managers on the same or parent object
            if (fireManager.GetComponent<ARRaycastManager>() == null)
                fireManager.gameObject.AddComponent<ARRaycastManager>();

            if (fireManager.GetComponent<ARPlaneManager>() == null)
            {
                var pm = fireManager.gameObject.AddComponent<ARPlaneManager>();
                var planePrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Samples/XR Interaction Toolkit/3.5.1/AR Starter Assets/Prefabs/AR Default Plane.prefab");
                if (planePrefab != null) pm.planePrefab = planePrefab;
            }

            // Find and wire HUD references if present
            var instObj = GameObject.Find("InstructionText");
            if (instObj != null) fireManager.instructionText = instObj.GetComponent<UnityEngine.UI.Text>();

            var stepObj = GameObject.Find("StepBadgeText");
            if (stepObj != null) fireManager.stepBadgeText = stepObj.GetComponent<UnityEngine.UI.Text>();

            var fillObj = GameObject.Find("ThreatFill");
            if (fillObj != null) fireManager.fireHealthFillImage = fillObj.GetComponent<UnityEngine.UI.Image>();

            var percentObj = GameObject.Find("PercentText");
            if (percentObj != null) fireManager.fireHealthPercentText = percentObj.GetComponent<UnityEngine.UI.Text>();

            var threatContainer = GameObject.Find("FireThreatHUD");
            if (threatContainer != null) fireManager.fireHealthContainer = threatContainer;

            var victoryModal = GameObject.Find("VictoryModal");
            if (victoryModal != null)
            {
                fireManager.victoryModal = victoryModal;
                var vicTitle = GameObject.Find("VictoryTitle");
                if (vicTitle != null) fireManager.victoryTitleText = vicTitle.GetComponent<UnityEngine.UI.Text>();
                var vicSubtitle = GameObject.Find("VictorySubtitle");
                if (vicSubtitle != null) fireManager.victorySubtitleText = vicSubtitle.GetComponent<UnityEngine.UI.Text>();
                var vicBtn = GameObject.Find("VictoryBackButton");
                if (vicBtn != null)
                {
                    fireManager.victoryBackButton = vicBtn.GetComponent<UnityEngine.UI.Button>();
                    if (vicBtn.GetComponent<ReturnToHome>() == null)
                        vicBtn.AddComponent<ReturnToHome>();
                }
            }

            var vo = fireManager.GetComponent<DrillVoiceoverManager>();
            if (vo == null)
                vo = fireManager.gameObject.AddComponent<DrillVoiceoverManager>();

            LinkAudioClips(vo);

            EditorUtility.SetDirty(fireManager);
            EditorSceneManager.SaveScene(scene);
            Debug.Log("Saved AR Scene with Landscape UI and all prefabs properly linked.");
        }
        else
        {
            Debug.LogError("ARFireManager not found in scene!");
        }
    }

    static void LinkAudioClips(DrillVoiceoverManager vo)
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
        Debug.Log("[ForceFireFix] Linked all English & Hindi Voiceover audio clips to DrillVoiceoverManager!");
    }
}
