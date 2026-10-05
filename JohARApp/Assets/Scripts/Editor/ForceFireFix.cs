using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

public class ForceFireFix
{
    [MenuItem("JohAR/Force Link Prefabs")]
    public static void Execute()
    {
        var scene = EditorSceneManager.OpenScene("Assets/Scenes/2_FireSafetyAR.unity");
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

            EditorUtility.SetDirty(fireManager);
            EditorSceneManager.SaveScene(scene);
            Debug.Log("Saved AR Scene with all prefabs properly linked.");
        }
        else
        {
            Debug.LogError("ARFireManager not found in scene!");
        }
    }
}
