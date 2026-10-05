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
        Texture2D defaultPart = AssetDatabase.GetBuiltinExtraResource<Texture2D>("Default-Particle.psd");
        if (defaultPart == null)
        {
            defaultPart = Resources.GetBuiltinResource<Texture2D>("Default-Particle.psd");
        }
        string[] matPaths = new string[] {
            "Assets/Materials/FireParticleMat.mat",
            "Assets/Materials/EmberParticleMat.mat"
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

        Texture2D autoSmokeTex = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TrueClouds/Textures/TrueCloudSmoke.png");
        if (autoSmokeTex == null)
            autoSmokeTex = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TrueClouds/Textures/defaultNoise.png");

        if (autoSmokeTex != null)
        {
            string[] autoSmokeMatPaths = new string[] {
                "Assets/Models/Extinguisher/SmokeParticleMat.mat",
                "Assets/Materials/SmokeParticleMat.mat"
            };

            foreach (string p in autoSmokeMatPaths)
            {
                Material sm = AssetDatabase.LoadAssetAtPath<Material>(p);
                if (sm != null && sm.GetTexture("_BaseMap") != autoSmokeTex)
                {
                    sm.SetTexture("_BaseMap", autoSmokeTex);
                    sm.SetTexture("_MainTex", autoSmokeTex);
                    EditorUtility.SetDirty(sm);
                    changed = true;
                    Debug.Log("[AutoFix] Linked TrueClouds smoke texture for material: " + p);
                }
            }
        }

        // 3. Ensure ExtinguisherPrefab has TrueClouds Realistic Smoke & Aligned Forward Nozzle
        GameObject curExt = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/AR/ExtinguisherPrefab.prefab");
        if (curExt != null)
        {
            var ps = curExt.GetComponentInChildren<ParticleSystem>(true);
            Transform spray = curExt.transform.Find("SprayPoint");
            bool needsRebuild = ps == null || !ps.noise.enabled || ps.main.maxParticles > 30 ||
                                spray == null || Mathf.Abs(spray.localPosition.y - 0.2728f) > 0.01f;
            if (needsRebuild)
            {
                CreateExtinguisherPrefab.CreatePrefab();
                changed = true;
                Debug.Log("[AutoFix] Upgraded ExtinguisherPrefab with TrueClouds Realistic Smoke VFX & Forward Nozzle!");
            }
        }

        if (changed)
        {
            AssetDatabase.SaveAssets();
            Debug.Log("<b>[AutoFix]</b> All missing references and textures automatically fixed!");
        }
    }
}
