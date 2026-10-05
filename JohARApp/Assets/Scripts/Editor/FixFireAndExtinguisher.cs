using UnityEngine;
using UnityEditor;

public class FixFireAndExtinguisher : MonoBehaviour
{
    [MenuItem("JohAR/Fix Ultimate Models")]
    public static void FixIt()
    {
        // 1. FIX EXTINGUISHER PREFAB SCALE
        string extPrefabPath = "Assets/Prefabs/AR/ExtinguisherPrefab.prefab";
        GameObject extPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(extPrefabPath);
        if (extPrefab != null)
        {
            GameObject inst = (GameObject)PrefabUtility.InstantiatePrefab(extPrefab);
            
            // Find the FBX visual child
            Transform fbxTransform = null;
            foreach (Transform child in inst.transform)
            {
                if (child.name.Contains("fire_extinguisher")) // Default name for the FBX root
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
                    for (int i = 1; i < renderers.Length; i++)
                        b.Encapsulate(renderers[i].bounds);
                    
                    float maxDim = Mathf.Max(b.size.x, Mathf.Max(b.size.y, b.size.z));
                    if (maxDim > 0)
                    {
                        // We want it to be ~0.35 units (35 cm) tall/wide
                        float targetScale = 0.35f / maxDim;
                        // Apply this scale globally
                        fbxTransform.localScale = Vector3.one * targetScale;
                        
                        // Recenter it so the pivot is at the bottom
                        Vector3 offset = fbxTransform.position - b.center;
                        fbxTransform.localPosition = new Vector3(0, -b.extents.y * targetScale, 0); // Put bottom at y=0
                        
                        Debug.Log("Scaled Extinguisher! Old Max Dim: " + maxDim + " Target Scale factor: " + targetScale);
                    }
                }
            }
            
            // Adjust the collider
            BoxCollider col = inst.GetComponent<BoxCollider>();
            if (col != null)
            {
                col.size = new Vector3(0.2f, 0.4f, 0.2f);
                col.center = new Vector3(0, 0.2f, 0);
            }

            PrefabUtility.SaveAsPrefabAsset(inst, extPrefabPath);
            DestroyImmediate(inst);
        }

        // 2. FIX FIRE PARTICLES TEXTURE
        Texture2D defaultPart = Resources.GetBuiltinResource<Texture2D>("Default-ParticleSystem.psd");

        string[] matPaths = new string[] {
            "Assets/Materials/FireMat.mat",
            "Assets/Materials/EmberMat.mat",
            "Assets/Models/Extinguisher/SmokeParticleMat.mat",
            "Assets/Materials/SmokeParticleMat.mat"
        };

        foreach (string p in matPaths)
        {
            Material mat = AssetDatabase.LoadAssetAtPath<Material>(p);
            if (mat != null && defaultPart != null)
            {
                mat.SetTexture("_BaseMap", defaultPart);
                mat.SetTexture("_MainTex", defaultPart);
                EditorUtility.SetDirty(mat);
                Debug.Log("Fixed texture for material: " + p);
            }
        }

        AssetDatabase.SaveAssets();
        Debug.Log("<b>[JohAR Fixes]</b> Completed! Fire texture and Extinguisher scale fixed.");
    }
}
