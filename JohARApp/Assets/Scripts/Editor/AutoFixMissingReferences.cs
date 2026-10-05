using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

[InitializeOnLoad]
public class AutoFixMissingReferences
{
    static AutoFixMissingReferences()
    {
        EditorApplication.delayCall += DoFix;
    }

    static void DoFix()
    {
        if (EditorApplication.isPlaying) return;

        bool changed = false;

        // 1. Fix Fire and Extinguisher Prefabs Missing References in Scene
        string scenePath = "Assets/Scenes/2_FireSafetyAR.unity";
        if (System.IO.File.Exists(scenePath))
        {
            Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
            ARFireManager arManager = Object.FindAnyObjectByType<ARFireManager>();
            
            if (arManager != null)
            {
                GameObject extPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
                if (extPrefab != null && arManager.extinguisherPrefab != extPrefab)
                {
                    arManager.extinguisherPrefab = extPrefab;
                    changed = true;
                    Debug.Log("[AutoFix] Re-linked missing ExtinguisherPrefab in ARFireManager!");
                }
            }

            if (changed)
            {
                EditorSceneManager.SaveScene(scene, scenePath);
            }
        }

        // 2. Fix Fire Material (Pink Cubes)
        Texture2D defaultPart = Resources.GetBuiltinResource<Texture2D>("Default-ParticleSystem.psd");
        string[] matPaths = new string[] {
            "Assets/Materials/FireParticleMat.mat",
            "Assets/Materials/EmberParticleMat.mat",
            "Assets/Models/Extinguisher/SmokeParticleMat.mat"
        };

        foreach (string p in matPaths)
        {
            Material mat = AssetDatabase.LoadAssetAtPath<Material>(p);
            if (mat != null && defaultPart != null && mat.GetTexture("_BaseMap") != defaultPart)
            {
                mat.SetTexture("_BaseMap", defaultPart);
                mat.SetTexture("_MainTex", defaultPart);
                EditorUtility.SetDirty(mat);
                changed = true;
                Debug.Log("[AutoFix] Restored missing texture for material: " + p);
            }
        }

        // 3. Force Scale of Extinguisher (In case it's huge or tiny)
        GameObject extAsset = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
        if (extAsset != null)
        {
            GameObject inst = (GameObject)PrefabUtility.InstantiatePrefab(extAsset);
            Transform fbxTransform = null;
            
            // Look for the FBX mesh child
            foreach (Transform child in inst.transform)
            {
                if (child.GetComponentInChildren<MeshRenderer>() != null && 
                    child.name != "SmokeSpray" && child.name != "Seal" && child.name != "Pin")
                {
                    fbxTransform = child;
                    break;
                }
            }

            if (fbxTransform != null)
            {
                Renderer[] renderers = fbxTransform.GetComponentsInChildren<Renderer>();
                if (renderers.Length > 0)
                {
                    Bounds b = renderers[0].bounds;
                    for (int i = 1; i < renderers.Length; i++) b.Encapsulate(renderers[i].bounds);
                    
                    float maxDim = Mathf.Max(b.size.x, Mathf.Max(b.size.y, b.size.z));
                    if (maxDim > 0 && maxDim > 1.0f || maxDim < 0.1f) // Only fix if it's way out of bounds
                    {
                        float targetScale = 0.35f / maxDim; // Make it exactly 35cm
                        fbxTransform.localScale = Vector3.one * targetScale;
                        Vector3 offset = fbxTransform.position - b.center;
                        fbxTransform.localPosition = new Vector3(0, -b.extents.y * targetScale, 0); 
                        
                        PrefabUtility.SaveAsPrefabAsset(inst, "Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
                        changed = true;
                        Debug.Log("[AutoFix] Rescaled FBX Extinguisher model to 35cm!");
                    }
                }
            }
            Object.DestroyImmediate(inst);
        }

        if (changed)
        {
            AssetDatabase.SaveAssets();
            Debug.Log("<b>[AutoFix]</b> All missing references and textures automatically fixed!");
        }
    }
}
