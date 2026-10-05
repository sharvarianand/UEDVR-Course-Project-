using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

public class CreateExtinguisherPrefab
{
    [MenuItem("JohAR/Create Extinguisher Prefab")]
    public static void CreatePrefab()
    {
        string modelPath = "Assets/Models/Extinguisher/fire_extinguisher.fbx";
        GameObject fbxModel = AssetDatabase.LoadAssetAtPath<GameObject>(modelPath);
        
        if (fbxModel == null)
        {
            Debug.LogError("FBX model not found at " + modelPath);
            return;
        }

        // 1. MATERIALS SETUP
        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        // Main Canister & Parts Material
        Material extMat = new Material(litShader);
        extMat.name = "ExtinguisherMat";
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

        // Distinct Materials for Seal (Bright Yellow), Pin (Silver Metal), Nozzle (Matte Black)
        Material sealMat = new Material(litShader);
        sealMat.name = "SealMat";
        sealMat.color = new Color(1f, 0.82f, 0.05f, 1f);
        sealMat.SetFloat("_Smoothness", 0.5f);
        AssetDatabase.CreateAsset(sealMat, "Assets/Models/Extinguisher/SealMat.mat");

        Material pinMat = new Material(litShader);
        pinMat.name = "PinMat";
        pinMat.color = new Color(0.88f, 0.90f, 0.94f, 1f);
        pinMat.SetFloat("_Metallic", 0.95f);
        pinMat.SetFloat("_Smoothness", 0.85f);
        AssetDatabase.CreateAsset(pinMat, "Assets/Models/Extinguisher/PinMat.mat");

        Material nozzleMat = new Material(litShader);
        nozzleMat.name = "NozzleMat";
        nozzleMat.color = new Color(0.12f, 0.12f, 0.14f, 1f);
        nozzleMat.SetFloat("_Smoothness", 0.35f);
        AssetDatabase.CreateAsset(nozzleMat, "Assets/Models/Extinguisher/NozzleMat.mat");

        // 2. ROOT OBJECT
        GameObject extRoot = new GameObject("ExtinguisherPrefab");

        // 3. VISUAL MODEL
        GameObject visual = (GameObject)PrefabUtility.InstantiatePrefab(fbxModel);
        PrefabUtility.UnpackPrefabInstance(visual, PrefabUnpackMode.Completely, InteractionMode.AutomatedAction);
        visual.transform.SetParent(extRoot.transform, false);

        // Strip unwanted Blender Camera and Light
        foreach (var c in visual.GetComponentsInChildren<Camera>(true)) Object.DestroyImmediate(c.gameObject);
        foreach (var l in visual.GetComponentsInChildren<Light>(true)) Object.DestroyImmediate(l.gameObject);

        // ROTATION ALIGNMENT:
        // In the raw FBX, the front discharge valve is at +X, handles are at -X, gauge is at +Z.
        // Rotating by -90 deg on Y brings +X (front discharge) to +Z (FORWARD toward fire),
        // -X (handles) to -Z (BACKWARD toward player's palm), and gauge to sideways view.
        visual.transform.localRotation = Quaternion.Euler(0f, -90f, 0f);

        // Scale & Center Extinguisher to exactly 35cm height
        Renderer[] renderers = visual.GetComponentsInChildren<Renderer>();
        if (renderers.Length > 0)
        {
            Bounds b = renderers[0].bounds;
            for (int i = 1; i < renderers.Length; i++) b.Encapsulate(renderers[i].bounds);
            
            float maxDim = Mathf.Max(b.size.x, Mathf.Max(b.size.y, b.size.z));
            if (maxDim > 0.0001f)
            {
                float targetScale = 0.35f / maxDim;
                visual.transform.localScale = Vector3.one * targetScale;
                visual.transform.localPosition = new Vector3(-b.center.x * targetScale, -b.min.y * targetScale, -b.center.z * targetScale);
            }
        }

        // 4. IDENTIFY & CONFIGURE SUBPARTS
        Transform seal1 = null;
        Transform seal2 = null;
        Transform pinObj = null;
        Transform nozzleHornObj = null;
        var foundSeals = new List<Transform>();

        foreach (Transform t in visual.GetComponentsInChildren<Transform>(true))
        {
            if (t == visual.transform) continue;
            string n = t.name.ToLower();

            if (n.Contains("seal"))
            {
                foundSeals.Add(t);
                if (n.Contains("seal1") || t.name == "Fire_Extinguisher_SEAl1") seal1 = t;
                else if (n.Contains("seal2") || t.name == "Fire_Extinguisher_SEAL2") seal2 = t;

                SphereCollider sc = t.gameObject.GetComponent<SphereCollider>();
                if (sc == null) sc = t.gameObject.AddComponent<SphereCollider>();
                sc.radius = 0.07f;

                var mr = t.GetComponent<MeshRenderer>();
                if (mr != null) mr.sharedMaterial = sealMat;
            }
            else if (n.Contains("pin"))
            {
                pinObj = t;
                SphereCollider pc = t.gameObject.GetComponent<SphereCollider>();
                if (pc == null) pc = t.gameObject.AddComponent<SphereCollider>();
                pc.radius = 0.07f;

                var mr = t.GetComponent<MeshRenderer>();
                if (mr != null) mr.sharedMaterial = pinMat;
            }
            else if (t.name == "Fire_Extinguisher_geo.015")
            {
                // Nozzle discharge horn: reposition directly onto the front valve outlet
                nozzleHornObj = t;
                var mr = t.GetComponent<MeshRenderer>();
                if (mr != null) mr.sharedMaterial = nozzleMat;
            }
            else if (t.name == "Fire_Extinguisher_geo.016" || t.name == "Fire_Extinguisher_geo.017" ||
                     t.name == "Fire_Extinguisher_geo.019" || t.name == "Fire_Extinguisher_geo.020" ||
                     t.name == "Fire_Extinguisher_geo.021")
            {
                // Disable rigid stored side-clamp and looped hose meshes for a clean direct forward nozzle
                t.gameObject.SetActive(false);
            }
            else
            {
                var mr = t.GetComponent<MeshRenderer>();
                if (mr != null) mr.sharedMaterial = extMat;
            }
        }

        // Reposition Nozzle Horn so it emerges right from the discharge valve pointing forward
        if (nozzleHornObj != null)
        {
            nozzleHornObj.SetParent(extRoot.transform, true);
            nozzleHornObj.localPosition = new Vector3(0.0000f, 0.2728f, 0.0380f);
            nozzleHornObj.localRotation = Quaternion.Euler(4f, 0f, 0f);
        }

        // 5. SPRAY POINT (Positioned right at the physical aperture tip of the nozzle horn)
        GameObject sprayPoint = new GameObject("SprayPoint");
        sprayPoint.transform.SetParent(extRoot.transform, false);
        sprayPoint.transform.localPosition = new Vector3(0.0000f, 0.2728f, 0.0820f);
        sprayPoint.transform.localRotation = Quaternion.Euler(4f, 0f, 0f); // Directed forward and slightly down towards the fire

        // 6. TRUECLOUDS REALISTIC VOLUMETRIC SMOKE (Optimized for Mobile/Low-End AR)
        GameObject smokeObj = new GameObject("SmokeSpray");
        smokeObj.transform.SetParent(sprayPoint.transform, false);
        smokeObj.transform.localPosition = Vector3.zero;
        smokeObj.transform.localRotation = Quaternion.identity; // Fires directly forward from nozzle!

        ParticleSystem smoke = smokeObj.AddComponent<ParticleSystem>();
        var smokeMain = smoke.main;
        smokeMain.startLifetime = new ParticleSystem.MinMaxCurve(0.85f, 1.30f);
        smokeMain.startSpeed = new ParticleSystem.MinMaxCurve(7.5f, 11.0f); // High-pressure forward ejection
        smokeMain.startSize = new ParticleSystem.MinMaxCurve(0.05f, 0.10f);
        smokeMain.startRotation = new ParticleSystem.MinMaxCurve(0f, 360f * Mathf.Deg2Rad);
        smokeMain.maxParticles = 24; // Strict low-end mobile cap: ~18 active billows max
        smokeMain.simulationSpace = ParticleSystemSimulationSpace.World; // Particles billow naturally in room space as phone sweeps
        smokeMain.gravityModifier = -0.015f; // Slight thermal float
        smokeMain.loop = true;
        smokeMain.playOnAwake = false;
        smokeMain.cullingMode = ParticleSystemCullingMode.Automatic;

        var smokeEmission = smoke.emission;
        smokeEmission.rateOverTime = 18;

        var smokeShape = smoke.shape;
        smokeShape.shapeType = ParticleSystemShapeType.Cone;
        smokeShape.angle = 6.5f; // Tight pressurized nozzle cone
        smokeShape.radius = 0.014f; // Tight nozzle opening

        // Atmospheric drag: supersonic stream rapidly decelerates into rolling cloud billows
        var limitVel = smoke.limitVelocityOverLifetime;
        limitVel.enabled = true;
        limitVel.limit = 1.1f;
        limitVel.dampen = 0.40f;

        // Volumetric cloud expansion: tight nozzle exit expanding into wide rolling fog
        var smokeSizeOL = smoke.sizeOverLifetime;
        smokeSizeOL.enabled = true;
        AnimationCurve smokeSizeCurve = new AnimationCurve();
        smokeSizeCurve.AddKey(0.0f, 0.35f);
        smokeSizeCurve.AddKey(0.25f, 1.35f);
        smokeSizeCurve.AddKey(0.65f, 2.2f);
        smokeSizeCurve.AddKey(1.0f, 2.7f);
        smokeSizeOL.size = new ParticleSystem.MinMaxCurve(1f, smokeSizeCurve);

        // Alpha & Color: smooth emergence, dense powder core, gradual dissipation
        var smokeColorOL = smoke.colorOverLifetime;
        smokeColorOL.enabled = true;
        Gradient smokeGrad = new Gradient();
        smokeGrad.SetKeys(
            new GradientColorKey[] {
                new GradientColorKey(new Color(0.97f, 0.98f, 1.0f), 0.0f),
                new GradientColorKey(new Color(0.93f, 0.95f, 0.98f), 0.5f),
                new GradientColorKey(new Color(0.89f, 0.91f, 0.94f), 1.0f)
            },
            new GradientAlphaKey[] {
                new GradientAlphaKey(0.0f, 0.0f),
                new GradientAlphaKey(0.88f, 0.06f),
                new GradientAlphaKey(0.65f, 0.60f),
                new GradientAlphaKey(0.0f, 1.0f)
            }
        );
        smokeColorOL.color = new ParticleSystem.MinMaxGradient(smokeGrad);

        // Organic swirl rotation
        var smokeRotOL = smoke.rotationOverLifetime;
        smokeRotOL.enabled = true;
        smokeRotOL.z = new ParticleSystem.MinMaxCurve(-35f * Mathf.Deg2Rad, 35f * Mathf.Deg2Rad);

        // TrueClouds Procedural 3D Noise (Realistic rolling cloud turbulence)
        var smokeNoise = smoke.noise;
        smokeNoise.enabled = true;
        smokeNoise.strength = 0.32f;
        smokeNoise.frequency = 0.75f;
        smokeNoise.scrollSpeed = 1.0f;
        smokeNoise.damping = true;
        smokeNoise.quality = ParticleSystemNoiseQuality.Low;

        var smokeTSA = smoke.textureSheetAnimation;
        smokeTSA.enabled = false;

        // URP Material with TrueClouds Volumetric Texture
        Shader particleShader = Shader.Find("Universal Render Pipeline/Particles/Unlit");
        if (particleShader == null) particleShader = Shader.Find("Particles/Standard Unlit");

        Material smokeMat = new Material(particleShader);
        Texture2D smokeTex = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TrueClouds/Textures/TrueCloudSmoke.png");
        if (smokeTex == null)
            smokeTex = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TrueClouds/Textures/defaultNoise.png");

        if (smokeTex != null)
        {
            smokeMat.SetTexture("_BaseMap", smokeTex);
            smokeMat.SetTexture("_MainTex", smokeTex);
        }
        smokeMat.SetColor("_BaseColor", new Color(0.97f, 0.98f, 1.0f, 0.88f));
        smokeMat.SetFloat("_Surface", 1); // Transparent
        smokeMat.SetFloat("_Blend", 0);   // Alpha Blending
        smokeMat.SetFloat("_SrcBlend", 5);
        smokeMat.SetFloat("_DstBlend", 10);
        smokeMat.SetFloat("_ZWrite", 0);
        smokeMat.SetFloat("_Cull", 0);
        smokeMat.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
        AssetDatabase.CreateAsset(smokeMat, "Assets/Models/Extinguisher/SmokeParticleMat.mat");

        var smokeRenderer = smokeObj.GetComponent<ParticleSystemRenderer>();
        smokeRenderer.material = smokeMat;
        smokeRenderer.sortingFudge = 10;

        // Secondary High-Pressure Needle Stream (Crisp ejection exiting nozzle aperture)
        GameObject coreObj = new GameObject("CoreJet");
        coreObj.transform.SetParent(smokeObj.transform, false);
        coreObj.transform.localPosition = Vector3.zero;
        coreObj.transform.localRotation = Quaternion.identity;

        ParticleSystem core = coreObj.AddComponent<ParticleSystem>();
        var coreMain = core.main;
        coreMain.startLifetime = new ParticleSystem.MinMaxCurve(0.18f, 0.28f);
        coreMain.startSpeed = new ParticleSystem.MinMaxCurve(8.5f, 12.0f);
        coreMain.startSize = new ParticleSystem.MinMaxCurve(0.025f, 0.05f);
        coreMain.startColor = new Color(1f, 1f, 1f, 0.95f);
        coreMain.simulationSpace = ParticleSystemSimulationSpace.World;
        coreMain.maxParticles = 6;
        coreMain.loop = true;
        coreMain.playOnAwake = false;

        var coreEmission = core.emission;
        coreEmission.rateOverTime = 12;

        var coreShape = core.shape;
        coreShape.shapeType = ParticleSystemShapeType.Cone;
        coreShape.angle = 2.5f;
        coreShape.radius = 0.008f;

        var coreRenderer = coreObj.GetComponent<ParticleSystemRenderer>();
        coreRenderer.material = smokeMat;

        // 7. LOGIC & INTERACTION
        var controller = extRoot.AddComponent<ExtinguisherController>();
        if (foundSeals.Count > 0)
        {
            controller.allSealParts = foundSeals.ToArray();
            controller.sealObject = seal1 != null ? seal1 : foundSeals[0];
            Debug.Log($"[CreateExtinguisherPrefab] Configured {foundSeals.Count} seal meshes.");
        }

        if (pinObj != null)
        {
            controller.pinObject = pinObj;
            Debug.Log($"[CreateExtinguisherPrefab] Configured pin mesh: '{pinObj.name}'");
        }
        
        BoxCollider tapCollider = extRoot.AddComponent<BoxCollider>();
        tapCollider.center = new Vector3(0, 0.18f, 0);
        tapCollider.size = new Vector3(0.25f, 0.45f, 0.25f);

        EditorUtility.SetDirty(controller);
        EditorUtility.SetDirty(extRoot);

        // 8. SAVE PREFAB (Preserve GUID so scene links are never broken)
        string prefabPath = "Assets/Prefabs/AR/ExtinguisherPrefab.prefab";
        PrefabUtility.SaveAsPrefabAsset(extRoot, prefabPath);
        Object.DestroyImmediate(extRoot);
        AssetDatabase.SaveAssets();

        Debug.Log("High-Quality Optimized Extinguisher Prefab created successfully!");
    }
}
