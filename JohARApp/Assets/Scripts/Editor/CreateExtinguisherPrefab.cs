using UnityEngine;
using UnityEditor;

public class CreateExtinguisherPrefab
{
    [MenuItem("JohAR/Create Extinguisher Prefab")]
    public static void CreatePrefab()
    {
        string modelPath = "Assets/Models/Extinguisher/fire_extinguisher.fbx";
        GameObject fbxModel = AssetDatabase.LoadAssetAtPath<GameObject>(modelPath);
        
        if (fbxModel == null)
        {
            Debug.LogError("FBX model not found at " + modelPath + ". Please ensure it was copied correctly.");
            return;
        }

        // 1. CREATE MATERIAL
        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        Material extMat = new Material(litShader);
        extMat.name = "ExtinguisherMat";

        // Assign Textures
        Texture2D texCM = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/Models/Extinguisher/fire_extinguisher_CM.png");
        Texture2D texNM = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/Models/Extinguisher/fire_extinguisher_NM.png");
        Texture2D texMM = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/Models/Extinguisher/fire_extinguisher_MM.png");
        Texture2D texAO = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/Models/Extinguisher/fire_extinguisher_AO.png");

        if (texNM != null)
        {
            TextureImporter ti = (TextureImporter)AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texNM));
            if (ti != null && ti.textureType != TextureImporterType.NormalMap)
            {
                ti.textureType = TextureImporterType.NormalMap;
                ti.SaveAndReimport();
            }
        }

        if (texCM != null) extMat.SetTexture("_BaseMap", texCM);
        if (texNM != null) { extMat.SetTexture("_BumpMap", texNM); extMat.EnableKeyword("_NORMALMAP"); }
        if (texMM != null) { extMat.SetTexture("_MetallicGlossMap", texMM); extMat.EnableKeyword("_METALLICSPECGLOSSMAP"); }
        if (texAO != null) { extMat.SetTexture("_OcclusionMap", texAO); extMat.EnableKeyword("_OCCLUSIONMAP"); }

        AssetDatabase.CreateAsset(extMat, "Assets/Models/Extinguisher/ExtinguisherMat.mat");

        // 2. ROOT OBJECT
        GameObject extRoot = new GameObject("ExtinguisherPrefab");

        // 3. VISUAL MODEL
        GameObject visual = (GameObject)PrefabUtility.InstantiatePrefab(fbxModel);
        PrefabUtility.UnpackPrefabInstance(visual, PrefabUnpackMode.Completely, InteractionMode.AutomatedAction);
        visual.transform.SetParent(extRoot.transform);
        visual.transform.localPosition = Vector3.zero;
        visual.transform.localScale = new Vector3(0.5f, 0.5f, 0.5f); // Scale down slightly just in case
        
        // Apply material to all renderers in FBX and calculate bounds to scale it properly
        Renderer[] renderers = visual.GetComponentsInChildren<Renderer>();
        if (renderers.Length > 0)
        {
            Bounds b = renderers[0].bounds;
            for (int i = 1; i < renderers.Length; i++) b.Encapsulate(renderers[i].bounds);
            
            float maxDim = Mathf.Max(b.size.x, Mathf.Max(b.size.y, b.size.z));
            if (maxDim > 0)
            {
                float targetScale = 0.35f / maxDim;
                visual.transform.localScale = Vector3.one * targetScale;
                visual.transform.localPosition = new Vector3(0, -b.extents.y * targetScale, 0); // Put bottom at y=0
            }
            
            foreach (MeshRenderer mr in visual.GetComponentsInChildren<MeshRenderer>())
            {
                mr.sharedMaterial = extMat;
            }
        }

        // 4. SPRAY POINT (Approximate top of extinguisher)
        GameObject sprayPoint = new GameObject("SprayPoint");
        sprayPoint.transform.SetParent(extRoot.transform);
        sprayPoint.transform.localPosition = new Vector3(0, 0.4f, 0.2f); // Guessed height/forward
        sprayPoint.transform.localRotation = Quaternion.Euler(0, 0, 0);

        // 5. SMOKE SPRAY
        GameObject smokeObj = new GameObject("SmokeSpray");
        smokeObj.transform.SetParent(sprayPoint.transform);
        smokeObj.transform.localPosition = Vector3.zero;

        ParticleSystem smoke = smokeObj.AddComponent<ParticleSystem>();
        var smokeMain = smoke.main;
        smokeMain.startLifetime = new ParticleSystem.MinMaxCurve(0.8f, 1.5f);
        smokeMain.startSpeed = new ParticleSystem.MinMaxCurve(1.5f, 3f);
        smokeMain.startSize = new ParticleSystem.MinMaxCurve(0.03f, 0.08f);
        smokeMain.startColor = new ParticleSystem.MinMaxGradient(
            new Color(0.9f, 0.9f, 0.9f, 0.7f),
            new Color(0.7f, 0.7f, 0.7f, 0.5f)
        );
        smokeMain.maxParticles = 100;
        smokeMain.simulationSpace = ParticleSystemSimulationSpace.World;
        smokeMain.gravityModifier = -0.05f;
        smokeMain.loop = true;
        smokeMain.playOnAwake = false;

        var smokeEmission = smoke.emission;
        smokeEmission.rateOverTime = 50;

        var smokeShape = smoke.shape;
        smokeShape.shapeType = ParticleSystemShapeType.Cone;
        smokeShape.angle = 12f;
        smokeShape.radius = 0.01f;

        var smokeSizeOL = smoke.sizeOverLifetime;
        smokeSizeOL.enabled = true;
        AnimationCurve smokeSizeCurve = new AnimationCurve();
        smokeSizeCurve.AddKey(0f, 0.5f);
        smokeSizeCurve.AddKey(0.5f, 1f);
        smokeSizeCurve.AddKey(1f, 2f);
        smokeSizeOL.size = new ParticleSystem.MinMaxCurve(1f, smokeSizeCurve);

        Shader particleShader = Shader.Find("Universal Render Pipeline/Particles/Unlit");
        if (particleShader == null) particleShader = Shader.Find("Particles/Standard Unlit");
        
        Material smokeMat = new Material(particleShader);
        smokeMat.SetColor("_BaseColor", new Color(0.85f, 0.85f, 0.85f, 0.6f));
        smokeMat.SetFloat("_Surface", 1); 
        smokeMat.SetFloat("_Blend", 0);   
        AssetDatabase.CreateAsset(smokeMat, "Assets/Models/Extinguisher/SmokeParticleMat.mat");

        var smokeRenderer = smokeObj.GetComponent<ParticleSystemRenderer>();
        smokeRenderer.material = smokeMat;

        // 5.5 FIND SEAL AND PIN FROM BLENDER MESH
        Transform seal1 = null;
        Transform seal2 = null;
        Transform pinObj = null;

        var foundSeals = new System.Collections.Generic.List<Transform>();

        Debug.Log("--- FBX NODES FOUND ---");
        foreach (Transform t in visual.GetComponentsInChildren<Transform>(true))
        {
            string n = t.name.ToLower();
            Debug.Log($"FBX Node: '{t.name}'");

            if (n.Contains("seal"))
            {
                foundSeals.Add(t);
                if (t.name == "Fire_Extinguisher_SEAL1") seal1 = t;
                else if (t.name == "Fire_Extinguisher_SEAL2") seal2 = t;

                SphereCollider sc = t.gameObject.GetComponent<SphereCollider>();
                if (sc == null) sc = t.gameObject.AddComponent<SphereCollider>();
                sc.radius = 0.08f;
            }
            else if (n.Contains("pin"))
            {
                pinObj = t;
                SphereCollider pc = t.gameObject.GetComponent<SphereCollider>();
                if (pc == null) pc = t.gameObject.AddComponent<SphereCollider>();
                pc.radius = 0.08f;
            }
        }

        // 6. LOGIC & INTERACTION
        var controller = extRoot.AddComponent<ExtinguisherController>();
        if (foundSeals.Count > 0)
        {
            controller.allSealParts = foundSeals.ToArray();
            controller.sealObject = foundSeals[0];
            Debug.Log($"[CreateExtinguisherPrefab] Configured {foundSeals.Count} seal meshes.");
        }
        else
        {
            Debug.LogWarning("[CreateExtinguisherPrefab] No seal meshes matching '*seal*' found in FBX!");
        }

        if (pinObj != null)
        {
            controller.pinObject = pinObj;
            Debug.Log($"[CreateExtinguisherPrefab] Configured pin mesh: '{pinObj.name}'");
        }
        else
        {
            Debug.LogWarning("[CreateExtinguisherPrefab] No pin mesh matching '*pin*' found in FBX!");
        }
        
        BoxCollider tapCollider = extRoot.AddComponent<BoxCollider>();
        tapCollider.center = new Vector3(0, 0.2f, 0);
        tapCollider.size = new Vector3(0.3f, 0.6f, 0.3f);

        EditorUtility.SetDirty(controller);
        EditorUtility.SetDirty(extRoot);

        // 7. SAVE
        string prefabPath = "Assets/Prefabs/AR/ExtinguisherPrefab.prefab";
        if (AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath) != null)
            AssetDatabase.DeleteAsset(prefabPath);

        PrefabUtility.SaveAsPrefabAsset(extRoot, prefabPath);
        Object.DestroyImmediate(extRoot);
        AssetDatabase.SaveAssets();

        Debug.Log("High-Quality Extinguisher Prefab created!");
    }
}
