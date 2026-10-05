using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// Represents one of the 3D equipment choices presented to the miner in AR:
/// 1. Water Bucket
/// 2. Fire Extinguisher
/// 3. Wet Cloth
/// </summary>
public class EquipmentOption3D : MonoBehaviour
{
    public enum ToolType
    {
        Water,
        Extinguisher,
        WetCloth
    }

    public ToolType toolType;
    public string toolNameEnglish;
    public string toolNameHindi;
    public string toolNameSantali;

    private Action<EquipmentOption3D> onSelectedCallback;
    private BoxCollider boxCollider;
    private Vector3 initialLocalPos;
    private bool isShaking = false;
    private bool isSelected = false;

    // Floating 3D Label
    private GameObject labelCanvasObj;
    private Text labelText;

    public void Initialize(ToolType type, Action<EquipmentOption3D> onSelected)
    {
        Initialize(type, null, onSelected);
    }

    public void Initialize(ToolType type, GameObject customPrefab, Action<EquipmentOption3D> onSelected)
    {
        toolType = type;
        onSelectedCallback = onSelected;
        initialLocalPos = transform.localPosition;

        switch (type)
        {
            case ToolType.Water:
                toolNameEnglish = "WATER BUCKET";
                toolNameHindi = "पानी की बाल्टी";
                toolNameSantali = "ᱫᱟᱜ ᱵᱟᱞᱴᱤ";
                BuildWaterVisual(customPrefab);
                break;
            case ToolType.Extinguisher:
                toolNameEnglish = "FIRE EXTINGUISHER";
                toolNameHindi = "अग्निशामक यंत्र";
                toolNameSantali = "ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱯᱟᱵ";
                BuildExtinguisherVisual(customPrefab);
                break;
            case ToolType.WetCloth:
                toolNameEnglish = "WET CLOTH";
                toolNameHindi = "गीला कपड़ा";
                toolNameSantali = "ᱞᱚᱦᱚᱫ ᱞᱩᱜᱽᱲᱤ";
                BuildWetClothVisual(customPrefab);
                break;
        }

        CreateFloatingLabel();

        // Ensure BoxCollider for Raycast taps if not already set
        if (boxCollider == null)
        {
            boxCollider = GetComponent<BoxCollider>();
            if (boxCollider == null)
                boxCollider = gameObject.AddComponent<BoxCollider>();
            boxCollider.size = new Vector3(0.45f, 0.55f, 0.45f);
            boxCollider.center = new Vector3(0f, 0.25f, 0f);
        }
    }

    private void Update()
    {
        if (isSelected) return;

        // Gentle floating bob
        if (!isShaking)
        {
            float bob = Mathf.Sin(Time.time * 2.5f + (int)toolType) * 0.02f;
            transform.localPosition = new Vector3(initialLocalPos.x, initialLocalPos.y + bob, initialLocalPos.z);
        }

        // Keep label facing camera
        Camera cam = Camera.main;
        if (cam == null) cam = FindAnyObjectByType<Camera>();
        if (labelCanvasObj != null && cam != null)
        {
            labelCanvasObj.transform.rotation = Quaternion.LookRotation(
                labelCanvasObj.transform.position - cam.transform.position
            );
        }
    }

    private void CreateFloatingLabel()
    {
        labelCanvasObj = new GameObject("LabelCanvas");
        labelCanvasObj.transform.SetParent(transform, false);

        float labelHeight = 0.48f;
        if (toolType == ToolType.Extinguisher) labelHeight = 0.68f;
        else if (toolType == ToolType.WetCloth) labelHeight = 0.38f;
        labelCanvasObj.transform.localPosition = new Vector3(0f, labelHeight, 0f);

        Canvas canvas = labelCanvasObj.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.WorldSpace;
        RectTransform rt = labelCanvasObj.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(240f, 60f);
        labelCanvasObj.transform.localScale = Vector3.one * 0.0025f;

        // Background pill
        GameObject bgObj = new GameObject("LabelBG");
        bgObj.transform.SetParent(labelCanvasObj.transform, false);
        Image bgImg = bgObj.AddComponent<Image>();
        bgImg.color = new Color(0.04f, 0.05f, 0.08f, 0.85f);
        RectTransform bgRt = bgObj.GetComponent<RectTransform>();
        bgRt.anchorMin = Vector2.zero;
        bgRt.anchorMax = Vector2.one;
        bgRt.sizeDelta = Vector2.zero;

        // Text
        GameObject textObj = new GameObject("LabelText");
        textObj.transform.SetParent(labelCanvasObj.transform, false);
        labelText = textObj.AddComponent<Text>();
        labelText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        if (labelText.font == null)
            labelText.font = Resources.GetBuiltinResource<Font>("Arial.ttf");

        labelText.alignment = TextAnchor.MiddleCenter;
        labelText.fontSize = 20;
        labelText.fontStyle = FontStyle.Bold;
        labelText.color = toolType == ToolType.Extinguisher ? new Color(1f, 0.8f, 0.2f) : Color.white;
        RectTransform textRt = textObj.GetComponent<RectTransform>();
        textRt.anchorMin = Vector2.zero;
        textRt.anchorMax = Vector2.one;
        textRt.sizeDelta = Vector2.zero;

        UpdateLabelLanguage();
    }

    public void UpdateLabelLanguage()
    {
        if (labelText == null) return;
        LanguageManager.Language lang = LanguageManager.Instance != null
            ? LanguageManager.Instance.CurrentLanguage
            : LanguageManager.Language.English;

        switch (lang)
        {
            case LanguageManager.Language.Hindi:
                labelText.text = toolNameHindi;
                break;
            case LanguageManager.Language.Santali:
                labelText.text = toolNameSantali;
                break;
            default:
                labelText.text = toolNameEnglish;
                break;
        }
    }

    public void OnTapped()
    {
        if (isSelected) return;
        onSelectedCallback?.Invoke(this);
    }

    public void ShakeWarning()
    {
        if (isShaking) return;
        StartCoroutine(DoShakeRoutine());
    }

    private IEnumerator DoShakeRoutine()
    {
        isShaking = true;
        Vector3 basePos = transform.localPosition;
        float duration = 0.45f;
        float elapsed = 0f;

        // Flash red label
        if (labelText != null) labelText.color = Color.red;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float xOffset = Mathf.Sin(elapsed * 45f) * 0.04f;
            transform.localPosition = basePos + new Vector3(xOffset, 0f, 0f);
            yield return null;
        }

        transform.localPosition = basePos;
        isShaking = false;
        if (labelText != null)
            labelText.color = toolType == ToolType.Extinguisher ? new Color(1f, 0.8f, 0.2f) : Color.white;
    }

    public void AnimateDeselectFade()
    {
        isSelected = true;
        StartCoroutine(DoFadeOutRoutine());
    }

    private IEnumerator DoFadeOutRoutine()
    {
        float elapsed = 0f;
        Vector3 startScale = transform.localScale;
        while (elapsed < 0.4f)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / 0.4f;
            transform.localScale = Vector3.Lerp(startScale, Vector3.zero, t);
            yield return null;
        }
        gameObject.SetActive(false);
    }

    // ==========================================
    // PROCEDURAL 3D MESH BUILDERS
    // ==========================================

    private void BuildWaterVisual(GameObject prefabOverride = null)
    {
        GameObject prefab = prefabOverride != null ? prefabOverride : Resources.Load<GameObject>("Prefabs/AR/BucketPrefab");
        if (prefab != null)
        {
            GameObject bucket = Instantiate(prefab, transform);
            bucket.transform.localPosition = Vector3.zero;
            bucket.transform.localRotation = Quaternion.Euler(0f, 25f, 0f);
            bucket.transform.localScale = Vector3.one * 0.95f;
            foreach (var col in bucket.GetComponentsInChildren<Collider>())
                DestroyImmediate(col);

            boxCollider = GetComponent<BoxCollider>();
            if (boxCollider == null) boxCollider = gameObject.AddComponent<BoxCollider>();
            boxCollider.size = new Vector3(0.42f, 0.48f, 0.42f);
            boxCollider.center = new Vector3(0f, 0.20f, 0f);
            return;
        }

        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        // Bucket Body (Tapered cylinder or cylinder)
        GameObject primitiveBucket = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        primitiveBucket.name = "BucketBody";
        primitiveBucket.transform.SetParent(transform, false);
        primitiveBucket.transform.localScale = new Vector3(0.24f, 0.16f, 0.24f);
        primitiveBucket.transform.localPosition = new Vector3(0f, 0.16f, 0f);
        DestroyImmediate(primitiveBucket.GetComponent<Collider>());

        Material bucketMat = new Material(litShader);
        bucketMat.color = new Color(0.2f, 0.4f, 0.75f); // Industrial blue plastic
        bucketMat.SetFloat("_Smoothness", 0.65f);
        primitiveBucket.GetComponent<Renderer>().material = bucketMat;

        // Water Top Surface
        GameObject waterSurface = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        waterSurface.name = "WaterSurface";
        waterSurface.transform.SetParent(transform, false);
        waterSurface.transform.localScale = new Vector3(0.23f, 0.005f, 0.23f);
        waterSurface.transform.localPosition = new Vector3(0f, 0.31f, 0f);
        DestroyImmediate(waterSurface.GetComponent<Collider>());

        Material waterMat = new Material(litShader);
        waterMat.color = new Color(0.1f, 0.6f, 0.95f, 0.85f); // Sparkling blue water
        waterMat.SetFloat("_Smoothness", 0.95f);
        waterSurface.GetComponent<Renderer>().material = waterMat;

        // Metal Handle
        GameObject handle = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        handle.name = "BucketHandle";
        handle.transform.SetParent(transform, false);
        handle.transform.localScale = new Vector3(0.015f, 0.14f, 0.015f);
        handle.transform.localPosition = new Vector3(0f, 0.38f, 0f);
        handle.transform.localRotation = Quaternion.Euler(0f, 0f, 90f);
        DestroyImmediate(handle.GetComponent<Collider>());

        Material metalMat = new Material(litShader);
        metalMat.color = new Color(0.85f, 0.85f, 0.9f);
        metalMat.SetFloat("_Metallic", 0.9f);
        metalMat.SetFloat("_Smoothness", 0.8f);
        handle.GetComponent<Renderer>().material = metalMat;
    }

    private void BuildExtinguisherVisual(GameObject prefabOverride = null)
    {
        // Check if Extinguisher prefab exists in resources or parameter
        GameObject prefab = prefabOverride != null ? prefabOverride : Resources.Load<GameObject>("Prefabs/AR/ExtinguisherPrefab");
        if (prefab != null)
        {
            GameObject ext = Instantiate(prefab, transform);
            ext.name = "PreviewExtinguisherMesh";

            // CRITICAL: ExtinguisherController is ONLY for the active held extinguisher during PASS drill.
            // On the selection challenge preview option, it MUST be removed so the extinguisher
            // stays centered in the 3D trio lineup instead of moving to the screen-right foreground.
            ExtinguisherController ctrl = ext.GetComponent<ExtinguisherController>();
            if (ctrl != null)
            {
                ctrl.followCamera = false;
                DestroyImmediate(ctrl);
            }

            // Stop any smoke particles on the preview
            foreach (var ps in ext.GetComponentsInChildren<ParticleSystem>())
            {
                ps.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
            }

            ext.transform.localPosition = Vector3.zero;
            ext.transform.localRotation = Quaternion.Euler(0f, 15f, 0f);
            ext.transform.localScale = Vector3.one * 0.85f;
            foreach (var col in ext.GetComponentsInChildren<Collider>())
                DestroyImmediate(col);

            boxCollider = GetComponent<BoxCollider>();
            if (boxCollider == null) boxCollider = gameObject.AddComponent<BoxCollider>();
            boxCollider.size = new Vector3(0.38f, 0.65f, 0.38f);
            boxCollider.center = new Vector3(0f, 0.30f, 0f);
            return;
        }

        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        // Red Canister Body
        GameObject cylinder = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        cylinder.name = "CanisterBody";
        cylinder.transform.SetParent(transform, false);
        cylinder.transform.localScale = new Vector3(0.16f, 0.22f, 0.16f);
        cylinder.transform.localPosition = new Vector3(0f, 0.22f, 0f);
        DestroyImmediate(cylinder.GetComponent<Collider>());

        Material redMat = new Material(litShader);
        redMat.color = new Color(0.85f, 0.1f, 0.1f); // Fire red
        redMat.SetFloat("_Smoothness", 0.7f);
        cylinder.GetComponent<Renderer>().material = redMat;

        // Black Valve Handle Top
        GameObject handle = GameObject.CreatePrimitive(PrimitiveType.Cube);
        handle.name = "ExtHandle";
        handle.transform.SetParent(transform, false);
        handle.transform.localScale = new Vector3(0.06f, 0.06f, 0.14f);
        handle.transform.localPosition = new Vector3(0f, 0.44f, 0f);
        DestroyImmediate(handle.GetComponent<Collider>());

        Material blackMat = new Material(litShader);
        blackMat.color = new Color(0.12f, 0.12f, 0.14f);
        handle.GetComponent<Renderer>().material = blackMat;

        // Yellow Tamper Seal Ring
        GameObject seal = GameObject.CreatePrimitive(PrimitiveType.Cube);
        seal.name = "SealGlow";
        seal.transform.SetParent(transform, false);
        seal.transform.localScale = new Vector3(0.03f, 0.03f, 0.03f);
        seal.transform.localPosition = new Vector3(-0.04f, 0.44f, 0f);
        DestroyImmediate(seal.GetComponent<Collider>());

        Material yellowMat = new Material(litShader);
        yellowMat.color = new Color(1f, 0.85f, 0.1f);
        seal.GetComponent<Renderer>().material = yellowMat;
    }

    private void BuildWetClothVisual(GameObject prefabOverride = null)
    {
        GameObject prefab = prefabOverride != null ? prefabOverride : Resources.Load<GameObject>("Prefabs/AR/ClothPrefab");
        if (prefab != null)
        {
            GameObject cloth = Instantiate(prefab, transform);
            cloth.transform.localPosition = Vector3.zero;
            cloth.transform.localRotation = Quaternion.Euler(0f, -15f, 0f);
            cloth.transform.localScale = Vector3.one * 1.0f;
            foreach (var col in cloth.GetComponentsInChildren<Collider>())
                DestroyImmediate(col);

            boxCollider = GetComponent<BoxCollider>();
            if (boxCollider == null) boxCollider = gameObject.AddComponent<BoxCollider>();
            boxCollider.size = new Vector3(0.45f, 0.38f, 0.35f);
            boxCollider.center = new Vector3(0f, 0.16f, 0f);
            return;
        }

        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        // Wooden stool/stand base
        GameObject stand = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        stand.name = "ClothStand";
        stand.transform.SetParent(transform, false);
        stand.transform.localScale = new Vector3(0.22f, 0.08f, 0.22f);
        stand.transform.localPosition = new Vector3(0f, 0.08f, 0f);
        DestroyImmediate(stand.GetComponent<Collider>());

        Material woodMat = new Material(litShader);
        woodMat.color = new Color(0.35f, 0.22f, 0.15f);
        stand.GetComponent<Renderer>().material = woodMat;

        // Folded wet burlap cloth pile
        GameObject clothObj = GameObject.CreatePrimitive(PrimitiveType.Cube);
        clothObj.name = "FoldedCloth";
        clothObj.transform.SetParent(transform, false);
        clothObj.transform.localScale = new Vector3(0.20f, 0.08f, 0.20f);
        clothObj.transform.localPosition = new Vector3(0f, 0.20f, 0f);
        clothObj.transform.localRotation = Quaternion.Euler(0f, 15f, 0f);
        DestroyImmediate(clothObj.GetComponent<Collider>());

        Material clothMat = new Material(litShader);
        clothMat.color = new Color(0.32f, 0.38f, 0.36f); // Dark wet gray-green canvas
        clothMat.SetFloat("_Smoothness", 0.3f);
        clothObj.GetComponent<Renderer>().material = clothMat;

        // Droplets / wet patch
        GameObject wetPatch = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        wetPatch.name = "WetPatch";
        wetPatch.transform.SetParent(transform, false);
        wetPatch.transform.localScale = new Vector3(0.12f, 0.03f, 0.12f);
        wetPatch.transform.localPosition = new Vector3(0f, 0.245f, 0f);
        DestroyImmediate(wetPatch.GetComponent<Collider>());

        Material dropMat = new Material(litShader);
        dropMat.color = new Color(0.15f, 0.4f, 0.55f);
        dropMat.SetFloat("_Smoothness", 0.95f);
        wetPatch.GetComponent<Renderer>().material = dropMat;
    }
}
