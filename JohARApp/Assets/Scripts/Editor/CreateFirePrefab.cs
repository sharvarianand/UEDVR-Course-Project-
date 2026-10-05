using UnityEngine;
using UnityEditor;

public class CreateFirePrefab
{
    [MenuItem("JohAR/Create Fire Prefab")]
    public static void Create()
    {
        // Ensure directory exists
        if (!AssetDatabase.IsValidFolder("Assets/Prefabs/AR"))
        {
            if (!AssetDatabase.IsValidFolder("Assets/Prefabs"))
                AssetDatabase.CreateFolder("Assets", "Prefabs");
            AssetDatabase.CreateFolder("Assets/Prefabs", "AR");
        }
        if (!AssetDatabase.IsValidFolder("Assets/Materials"))
            AssetDatabase.CreateFolder("Assets", "Materials");

        // ==========================================
        // 1. CREATE URP PARTICLE MATERIAL (Fire)
        // ==========================================
        Shader particleShader = Shader.Find("Universal Render Pipeline/Particles/Unlit");
        if (particleShader == null)
        {
            particleShader = Shader.Find("Particles/Standard Unlit");
        }
        if (particleShader == null)
        {
            Debug.LogError("Could not find particle shader! Trying fallback...");
            particleShader = Shader.Find("Unlit/Color");
        }

        Material fireMat = new Material(particleShader);
        fireMat.name = "FireParticleMat";
        fireMat.SetColor("_BaseColor", new Color(1f, 0.6f, 0.1f, 0.8f));
        fireMat.SetColor("_TintColor", new Color(1f, 0.6f, 0.1f, 0.8f)); // Fallback for standard particles
        
        // Find default particle texture
        Texture2D defaultParticleTex = AssetDatabase.GetBuiltinExtraResource<Texture2D>("Default-Particle.psd");
        if (defaultParticleTex == null)
            defaultParticleTex = Resources.GetBuiltinResource<Texture2D>("Default-Particle.psd");
            
        if (defaultParticleTex != null)
        {
            fireMat.SetTexture("_BaseMap", defaultParticleTex);
            fireMat.SetTexture("_MainTex", defaultParticleTex);
        }
        
        // Enable additive blending for fire glow
        fireMat.SetFloat("_Surface", 1); // Transparent
        fireMat.SetFloat("_Blend", 1);   // Additive
        fireMat.SetFloat("_SrcBlend", (float)UnityEngine.Rendering.BlendMode.SrcAlpha);
        fireMat.SetFloat("_DstBlend", (float)UnityEngine.Rendering.BlendMode.One);
        fireMat.renderQueue = 3000;
        fireMat.enableInstancing = true;
        AssetDatabase.CreateAsset(fireMat, "Assets/Materials/FireParticleMat.mat");

        // Ember material
        Material emberMat = new Material(particleShader);
        emberMat.name = "EmberParticleMat";
        emberMat.SetColor("_BaseColor", new Color(1f, 0.3f, 0f, 1f));
        emberMat.SetColor("_TintColor", new Color(1f, 0.3f, 0f, 1f));
        if (defaultParticleTex != null)
        {
            emberMat.SetTexture("_BaseMap", defaultParticleTex);
            emberMat.SetTexture("_MainTex", defaultParticleTex);
        }
        emberMat.SetFloat("_Surface", 1);
        emberMat.SetFloat("_Blend", 1);
        emberMat.SetFloat("_SrcBlend", (float)UnityEngine.Rendering.BlendMode.SrcAlpha);
        emberMat.SetFloat("_DstBlend", (float)UnityEngine.Rendering.BlendMode.One);
        emberMat.renderQueue = 3000;
        AssetDatabase.CreateAsset(emberMat, "Assets/Materials/EmberParticleMat.mat");

        // ==========================================
        // 2. CREATE FIRE PREFAB ROOT
        // ==========================================
        GameObject fireRoot = new GameObject("FireParticlePrefab");

        // ==========================================
        // 3. MAIN FIRE PARTICLE SYSTEM
        // ==========================================
        GameObject mainFireObj = new GameObject("MainFire");
        mainFireObj.transform.SetParent(fireRoot.transform);
        mainFireObj.transform.localPosition = Vector3.zero;

        ParticleSystem mainFire = mainFireObj.AddComponent<ParticleSystem>();
        var mainModule = mainFire.main;
        mainModule.startLifetime = new ParticleSystem.MinMaxCurve(0.4f, 0.9f);
        mainModule.startSpeed = new ParticleSystem.MinMaxCurve(0.2f, 0.5f);
        mainModule.startSize = new ParticleSystem.MinMaxCurve(0.05f, 0.15f);
        mainModule.startColor = new ParticleSystem.MinMaxGradient(
            new Color(1f, 0.9f, 0.3f, 0.7f),
            new Color(1f, 0.5f, 0.1f, 0.6f)
        );
        mainModule.maxParticles = 60;
        mainModule.simulationSpace = ParticleSystemSimulationSpace.World;
        mainModule.gravityModifier = -0.15f; // Gentle upward
        mainModule.loop = true;
        mainModule.playOnAwake = true;

        var emission = mainFire.emission;
        emission.rateOverTime = 30;

        var shape = mainFire.shape;
        shape.shapeType = ParticleSystemShapeType.Cone;
        shape.angle = 20f;
        shape.radius = 0.05f;
        shape.rotation = new Vector3(-90, 0, 0); // Point upward

        // Size over lifetime: start big, shrink
        var sizeOverLifetime = mainFire.sizeOverLifetime;
        sizeOverLifetime.enabled = true;
        AnimationCurve sizeCurve = new AnimationCurve();
        sizeCurve.AddKey(0f, 0.5f);
        sizeCurve.AddKey(0.3f, 1f);
        sizeCurve.AddKey(1f, 0f);
        sizeOverLifetime.size = new ParticleSystem.MinMaxCurve(1f, sizeCurve);

        // Color over lifetime: yellow -> orange -> red -> transparent
        var colorOverLifetime = mainFire.colorOverLifetime;
        colorOverLifetime.enabled = true;
        Gradient fireGradient = new Gradient();
        fireGradient.SetKeys(
            new GradientColorKey[] {
                new GradientColorKey(new Color(1f, 1f, 0.4f), 0f),
                new GradientColorKey(new Color(1f, 0.5f, 0f), 0.4f),
                new GradientColorKey(new Color(0.8f, 0.1f, 0f), 0.8f),
                new GradientColorKey(new Color(0.3f, 0f, 0f), 1f)
            },
            new GradientAlphaKey[] {
                new GradientAlphaKey(0.9f, 0f),
                new GradientAlphaKey(0.7f, 0.5f),
                new GradientAlphaKey(0f, 1f)
            }
        );
        colorOverLifetime.color = new ParticleSystem.MinMaxGradient(fireGradient);

        // Noise for flicker
        var noise = mainFire.noise;
        noise.enabled = true;
        noise.strength = 0.3f;
        noise.frequency = 3f;
        noise.scrollSpeed = 1.5f;
        noise.damping = true;

        // Renderer
        var mainRenderer = mainFireObj.GetComponent<ParticleSystemRenderer>();
        mainRenderer.material = fireMat;
        mainRenderer.renderMode = ParticleSystemRenderMode.Billboard;
        mainRenderer.sortMode = ParticleSystemSortMode.Distance;

        // ==========================================
        // 4. EMBER PARTICLE SYSTEM
        // ==========================================
        GameObject emberObj = new GameObject("Embers");
        emberObj.transform.SetParent(fireRoot.transform);
        emberObj.transform.localPosition = Vector3.zero;

        ParticleSystem embers = emberObj.AddComponent<ParticleSystem>();
        var emberMain = embers.main;
        emberMain.startLifetime = new ParticleSystem.MinMaxCurve(1f, 2f);
        emberMain.startSpeed = new ParticleSystem.MinMaxCurve(0.5f, 1.5f);
        emberMain.startSize = new ParticleSystem.MinMaxCurve(0.01f, 0.04f);
        emberMain.startColor = new ParticleSystem.MinMaxGradient(
            new Color(1f, 0.6f, 0f, 1f),
            new Color(1f, 0.2f, 0f, 1f)
        );
        emberMain.maxParticles = 30;
        emberMain.simulationSpace = ParticleSystemSimulationSpace.World;
        emberMain.gravityModifier = -0.2f;
        emberMain.loop = true;
        emberMain.playOnAwake = true;

        var emberEmission = embers.emission;
        emberEmission.rateOverTime = 10;

        var emberShape = embers.shape;
        emberShape.shapeType = ParticleSystemShapeType.Sphere;
        emberShape.radius = 0.1f;

        var emberRenderer = emberObj.GetComponent<ParticleSystemRenderer>();
        emberRenderer.material = emberMat;
        emberRenderer.renderMode = ParticleSystemRenderMode.Billboard;

        // ==========================================
        // 5. POINT LIGHT FOR GLOW
        // ==========================================
        GameObject lightObj = new GameObject("FireLight");
        lightObj.transform.SetParent(fireRoot.transform);
        lightObj.transform.localPosition = new Vector3(0, 0.2f, 0);

        Light fireLight = lightObj.AddComponent<Light>();
        fireLight.type = LightType.Point;
        fireLight.color = new Color(1f, 0.5f, 0.1f);
        fireLight.intensity = 2f;
        fireLight.range = 3f;
        fireLight.shadows = LightShadows.None;

        // Add flicker script
        lightObj.AddComponent<FireLightFlicker>();

        // ==========================================
        // 6. SAVE PREFAB
        // ==========================================
        string prefabPath = "Assets/Prefabs/AR/FireParticlePrefab.prefab";
        
        // Delete old prefab if it exists
        if (AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath) != null)
            AssetDatabase.DeleteAsset(prefabPath);
            
        PrefabUtility.SaveAsPrefabAsset(fireRoot, prefabPath);
        Object.DestroyImmediate(fireRoot);

        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();

        Debug.Log("Fire Particle Prefab created at: " + prefabPath);
    }
}
